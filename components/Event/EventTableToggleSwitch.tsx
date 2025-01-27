'use client';
import { Switch } from "@mui/material";

import { FormControlLabel } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function EventTableToggleSwitch({ archived, }: { archived: boolean }) {

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    return (
        <FormControlLabel
            sx={{ my: 2, }}
            control={
                <Switch
                    defaultChecked={archived || false}
                    onChange={(e, c) => {
                        const newSP = new URLSearchParams(searchParams);
                        if (c) {
                            newSP.set('archived', 'true');
                        } else {
                            newSP.set('archived', 'false');
                        }
                        router.push(`${pathname}?${newSP.toString()}`);
                    }}
                />
            }
            label="Show ONLY Archived Events"
        />
    );
}