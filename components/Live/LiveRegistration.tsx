/* eslint-disable react-hooks/exhaustive-deps */

'use client'

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid2,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from "@mui/material";
import Form from "next/form";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { LiveRegistrant, RegistrantType } from "@prisma/client";
import YesNoRadio from '@/components/Form/YesNoRadio';
import { ZodErrorSlimResponse } from "@/types";
import { CheckCircle, ExpandMore, Info, Pending, Visibility } from "@mui/icons-material";
import FormSaveButton from "../Form/FormSaveButton";
import prisma from "@/lib/db";
import { createRegistrant, validateRegistrant } from "@/actions/liveRegistrationManagement";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { User } from "next-auth";
import CheckoutForm from "./CheckoutForm";


export default function LiveRegistration({ user }: { user: User }) {
  const [fName, setFName] = useState<string>("");
  const [lName, setLName] = useState<string>("");
  const [preferredName, setPreferredName] = useState<string>("");
  const [registrantType, setRegistrantType] = useState<RegistrantType | ''>('');
  const [attendingLive, setAttendingLive] = useState<boolean | null>(null);
  const [usingHotelLink, setUsingHotelLink] = useState<boolean | null>(null);
  const [bringingEquipment, setBringingEquipment] = useState<boolean | null>(null);
  const [agreesAlcohol, setAgreesAlcohol] = useState<boolean | null>(null);
  const [open, setOpen] = useState<number>(0);
  const [phase, setPhase] = useState<'form' | 'payment' | 'done'>('form');
  const [registrantId, setRegistrantId] = useState<string | null>(null);

  const router = useRouter();

  const [status, setStatus] = useState<ReactNode[]>([
    <CircularProgress key={1} color="inherit" size={20} />,
    <CircularProgress key={2} color="inherit" size={20} />,
    <CircularProgress key={3} color="inherit" size={20} />,
    <CircularProgress key={4} color="inherit" size={20} />,
    <CircularProgress key={5} color="inherit" size={20} />,
  ]);

  const maxStep = 1;

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentCompleted, setPaymentCompleted] = useState<boolean>(false);
  const [isCreatingSession, setIsCreatingSession] = useState<boolean>(false);
  const email = user.email;

  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout
    return (...args: any[]) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }

  const debouncedUpdateStatus = useMemo(
    () => debounce(async () => {
      const res = await validateRegistrant({
        fName,
        lName,
        preferredName,
        registrantType,
        attendingLive,
        usingHotelLink,
        bringingEquipment,
        agreesAlcohol,
      }) as ZodErrorSlimResponse

      const firstStep = await getStepStatus(res, { fName, lName, preferredName, registrantType, attendingLive, usingHotelLink, bringingEquipment })

      setStatus([firstStep])
    }, 500),
    [fName, lName, preferredName, registrantType, attendingLive, usingHotelLink, bringingEquipment]
  )

  useEffect(() => {
    if (!registrantId || !attendingLive) return;

    const fetchClientSecret = async () => {
      const res = await fetch('/api/live/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrantId, attendingLive, email }),
      });
      const data = await res.json();
      setClientSecret(data.clientSecret);
    };

    fetchClientSecret();
  }, [registrantId, attendingLive]);

  const handleSubmit = async (formData: FormData): Promise<any> => {
    formData.set('fName', user.firstName ?? '');
    formData.set('lName', user.lastName ?? '');
    formData.set('cid', user.cid ?? '');
    formData.set('preferredName', preferredName);
    formData.set('registrantType', registrantType || 'HOME');
    formData.set('attendingLive', attendingLive);
    formData.set('usingHotelLink', usingHotelLink);

    if (attendingLive) {
      if (!agreesAlcohol) {
        toast.error("You must agree to the alcohol policy to register.");
        return false;
      }

      if (!bringingEquipment) {
        toast.error("You must agree to the equipment policy to register.");
        return false;
      }
    }

    const { registrant: newRegistrant, errors } = await createRegistrant(formData);

    if (errors) {
      toast.error(errors.map((error) => error.message).join('.  '));
      return false;
    }

    if (newRegistrant?.id) {
      setRegistrantId(newRegistrant.id);
    }

    const requiresPayment = attendingLive;

    if (requiresPayment) {
      toast.success("Registration submitted successfully! Moving on to payment...");
      setTimeout(() => setPhase('payment'), 2500);
    }
    else {
      router.push("/live/success");
    }

  }

  const back = () => {
    setOpen(prev => prev - 1)
    debouncedUpdateStatus()
  }

  const forward = () => {
    if (open < maxStep) {
      setOpen(prev => prev + 1)
    }
    debouncedUpdateStatus()
  }

  const NextButton = (
    <Stack direction="row" justifyContent="end" spacing={1}>
      <Button type="button" color="inherit" onClick={back} disabled={open <= 0}>Back</Button>
      <Button type="button" variant="contained" color="inherit" onClick={forward}>Next</Button>
    </Stack>
  )

  return (
    <>
      {phase === 'form' && (
        <>
          <Typography variant="h5" gutterBottom>Register for Orlando Live 2026!</Typography>
          <Form
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              await handleSubmit(formData);
            }}>
            <Box sx={{ my: 2 }}>
              <Typography variant="h6">Basic Information</Typography>
              <Grid2 container columns={2} spacing={2}>
                <Grid2 size={2}>
                  <TextField fullWidth variant="filled" required={true} name="fName" label="What is your legal first name?" disabled defaultValue={user.firstName} />
                </Grid2>
                <Grid2 size={2}>
                  <TextField fullWidth variant="filled" required={true} name="lName" label="What is your legal last name?" disabled defaultValue={user.lastName} />
                </Grid2>
                <Grid2 size={2}>
                  <TextField fullWidth variant="filled" name="preferredName" label="Do you have a preferred name?" value={preferredName} onChange={(e) => setPreferredName(e.target.value)} />
                </Grid2>
                <Grid2 size={2}>
                  <TextField fullWidth variant="filled" required={true} name="cid" label="What is your CID?" disabled defaultValue={user.cid} />
                </Grid2>
                <FormControl fullWidth>
                  <FormLabel required component="legend">Are you a home, visiting, or ACE Team controller?</FormLabel>
                  <RadioGroup name="registrantType" value={registrantType} onChange={(e, v) => setRegistrantType(v as RegistrantType)}>
                    {Object.keys(RegistrantType).map(type => (
                      <FormControlLabel key={type} value={type} control={<Radio />} label={<Typography variant="subtitle1">{type}</Typography>} />
                    ))}
                  </RadioGroup>
                </FormControl>
                <Grid2 size={2}>
                  <YesNoRadio
                    label="Do you plan on attending the main event in person on Saturday May 31st, 2025 in Orlando Florida?"
                    value={attendingLive}
                    onChange={setAttendingLive}
                    descriptionYes=""
                    descriptionNo=""
                  />
                </Grid2>
              </Grid2>

              {attendingLive === true && (
                <>
                  <Typography variant="h6">Hotel & Live Event Policies</Typography>
                  <Grid2 container columns={2} spacing={2}>
                    <Grid2 size={2}>
                      <YesNoRadio
                        label="Do you plan on booking at the hotel where the main event is taking place using our group link?"
                        value={usingHotelLink}
                        onChange={setUsingHotelLink}
                        descriptionYes=""
                        descriptionNo=""
                      />
                    </Grid2>
                    <Grid2 size={2}>
                      <YesNoRadio
                        label="I understand that alcoholic beverages may be consumed during this event and during official meetups. 
                Persons under the age of 21 are prohibited from consuming alcohol during the event and persons under the age of 
                21 who are caught consuming alcoholic beverages will be asked to leave the event and will not be refunded any 
                costs associated with attending the event. "
                        value={agreesAlcohol}
                        onChange={setAgreesAlcohol}
                        descriptionYes=""
                        descriptionNo=""
                      />
                    </Grid2>
                    <Grid2 size={2}>
                      <YesNoRadio
                        label="I understand that is my responsibility to bring my own computer set up to control on 
                the VATSIM Network during Orlando Overload 2025 if I plan on participating in the controlling 
                portion of the event. The following will be provided for use during the event. 
                Anything not on this list if your responsibility to bring with you: water, tables, chairs, power, and internet. 
                If you can bring extra power strips, monitors, mice, keyboards, etc that is greatly appreciated!"
                        value={bringingEquipment}
                        onChange={setBringingEquipment}
                        descriptionYes=""
                        descriptionNo=""
                      />
                    </Grid2>
                  </Grid2>
                </>
              )}
              <Grid2>
                <FormSaveButton text={attendingLive ? 'Submit Registration and Proceed to Payment' : 'Submit Registration'} />
              </Grid2>
            </Box>
          </Form>
        </>
      )}

      {phase === 'payment' && (
        <Grid2 container sx={{ minHeight: '80vh' }} >
          <Grid2
            size={{ xs: 12, md: 6 }}
            sx={{
              backgroundColor: "#0A4040",
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              p: 4,
              gap: 2,
            }}
          >
            <Typography variant="h4">You're paying the attendance fee for Orlando Overload 2025</Typography>
            <Typography variant="body1">
              This includes access to the main event, hotel information, and other perks. Please note that all registration fees are non-refundable.
              Once payment has been submitted, no refunds will be issued under any circumstances. All funds collected go directly toward covering the costs
              of organizing and hosting the event. We appreciate your understanding and support in making ORLO2026 a successful experience for all attendees.
            </Typography>

            <Stack spacing={3} sx={{ width: '100%' }}>
              <Stack direction="row" justifyContent="space-between" spacing={12} alignItems="center">
                <Typography>Subtotal</Typography>
                <Typography>$50</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography>Tax</Typography>
                <Typography>$0</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography fontWeight="bold">Total</Typography>
                <Typography fontWeight="bold">$50.00</Typography>
              </Stack>
            </Stack>
          </Grid2>

          <Grid2
            size={{ xs: 12, md: 6 }}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              p: 4,
            }}
          >
            {clientSecret ? (
              <Box sx={{ width: '100%', maxWidth: 400 }}>
                <CheckoutForm clientSecret={clientSecret} />
              </Box>
            ) : (
              <CircularProgress />
            )}
          </Grid2>

        </Grid2>
      )}
    </>
  );
};

const getStepStatus = async (parse: ZodErrorSlimResponse, input: { [key: string]: any }) => {
  if (parse.success || parse.errors.length === 0) {
    return <CheckCircle color="success" />
  }
  if (parse.errors.filter((error) => Object.keys(input).includes(error.path)).length > 0) {
    return <Info color="warning" />
  } else {
    return <CheckCircle color="success" />
  }
}
