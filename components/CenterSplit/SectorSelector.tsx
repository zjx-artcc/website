import { getColor } from "@/lib/sector"
import { useActiveSectors, useCenterSplitActions } from "@/lib/centerSplit"
import { PlusOne } from "@mui/icons-material"
import { Dialog, Input, Modal, Typography } from "@mui/material"
import { useState } from "react"
import { toast } from "react-toastify"

const SectorSelector: React.FC<Props> = ({editMode, onChange}: Props) => {
    const List: React.ReactElement[] = []
    const availableSectors = useActiveSectors()
    const {addSector, clearSectors, resetSectors} = useCenterSplitActions()
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [sectorInput, setSectorInput] = useState<string>('')

    const handleModalSubmit = () => {
        const int = parseInt(sectorInput)
        console.log(int)
        
        if (isNaN(int)) {
            toast.error('Entered value is not a number.')
        } else if (availableSectors.includes(int)) {
            toast.error(`Cannot add sector ${int} since it already exists.`)
        } else if (availableSectors.length >= 12) { // i only have 12 colors in sector.ts
            toast.error(`Cannot add more than 10 sectors.`)
        }
         else if (int > 100) {
            toast.error(`Sector does not exist`)
        } else {
            addSector(int)
            setModalOpen(false)
            setSectorInput('')
            onChange(int)
        }
    }

    if (availableSectors.length > 0) {
        availableSectors.map((data, i) => {
            List.push(
                <button 
                    type='button'
                    disabled={!editMode} 
                    className={'p-2 rounded-md ' + (editMode ? 'hover:border-2 transition' : '')} 
                    style={{backgroundColor: getColor(i)}} key={data + 'select'} 
                    onClick={() => onChange(data)}
                >
                    ZJX {data}
                </button>
            )   
        })   
    }

    // no selection
    List.push(
        <button 
            type='button'
            disabled={!editMode} 
            className={'p-2 rounded-md bg-gray-500 ' + (editMode ? 'hover:border-2 transition' : '')} 
            key={'-1 select'} 
            onClick={() => onChange(undefined)}
        >
            OFFLINE
        </button>
    )

    if (editMode) {
        // plus sign
        List.push(
            <button onClick={() => setModalOpen(true)} key={'add'} className='w-10 h-10 border-2'>
                <PlusOne/>
            </button>
        )
    }
    
    return (
        <div>
            <Dialog
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            >
                <div className='flex flex-col gap-y-2' style={{padding: 10}}>
                    <Typography variant='h6'>Enter Sector Id</Typography>
                    <Input type='number' value={sectorInput} onChange={(e) => setSectorInput(e.target.value)}></Input>
                    <button className='bg-sky-500' type='button' onClick={handleModalSubmit}>Enter</button>
                </div>
            </Dialog>
            <div className='flex flex-col gap-y-5'>
                <div className='flex flex-row gap-x-2'>
                    {List}
                </div>

                <div className="flex flex-row gap-x-2">
                    {editMode? 
                    <>
                        <button onClick={() => resetSectors()} key={'clear'} className='p-2 rounded-md  w-max h-10 bg-sky-500'>
                            Reset all
                        </button>

                        <button onClick={() => clearSectors()} key={'clear'} className='p-2 rounded-md w-max h-10  bg-sky-500'>
                            Clear all
                        </button>
                    </>   
                    : ''}
                </div>
            </div>
        </div>
    )
}

export default SectorSelector

interface Props {
    onChange: (sectorId: number | undefined) => void
    editMode: boolean
}