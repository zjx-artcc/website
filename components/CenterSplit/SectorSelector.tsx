import { getColor } from "@/lib/sector"
import { useActiveSectors, useCenterSplitActions } from "@/lib/centerSplit"
import { PlusOne } from "@mui/icons-material"

const SectorSelector: React.FC<Props> = ({editMode, onChange}: Props) => {
    const List: React.ReactElement[] = []
    const availableSectors = useActiveSectors()
    const {addSector} = useCenterSplitActions()

    if (availableSectors.length > 0) {
        availableSectors.map((data, i) => {
            List.push(
                <button 
                    type='button'
                    disabled={!editMode} 
                    className={'p-2 rounded-md ' + (editMode ? 'hover:border-2 transition' : '')} 
                    style={{backgroundColor: getColor(i)}} key={data + 500} 
                    onClick={() => onChange(data)}
                >
                    ZJX Sector {data}
                </button>
            )   
        })   
    } else {
        List.push(
            <button key={-10}>
                None
            </button>
        )
    }

    List.push(
        <button onClick={() => addSector(12)} className='w-10 h-10 border-2'>
            <PlusOne/>
        </button>
    )
    return (
        <div className='flex flex-row gap-x-2'>
            {List}
        </div>
    )
}

export default SectorSelector

interface Props {
    onChange: (sectorId: number) => void
    editMode: boolean
}