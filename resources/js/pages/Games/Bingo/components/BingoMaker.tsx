import Input from "@/components/form/input/InputField"
import { startBingo } from "@/store/slices/bingoSlice";
import { useState } from "react"
import { useDispatch } from "react-redux";

interface BingoMakerProps {
}
export default function BingoMaker({ }: BingoMakerProps) {

    const [bingoSize,setBingoSize]=useState(3);
      const dispatch = useDispatch();

    const handleBingoSizeChange=(e)=>{
        e.preventDefault();
        setBingoSize(e.target.value)
    }
    return (
        <div className="items-center justify-center bg-white w-full min-h-[20rem] rounded p-4 text-center border-2 border-purple-200">
            <p className="text-xl font-[800] m-0">Create Bingo</p>
            <div className="py-2">
                <Input 
                type="number" 
                placeholder="Bingo Size" 
                value={bingoSize} 
                onChange={(e)=>handleBingoSizeChange(e)}
                step={1} 
                min="3" 
                max="5" 
                hint="choose your bingo game size" 
                />
            </div>
            <div className="py-2">
                <button 
                onClick={()=>dispatch(startBingo(bingoSize))}
                className="btn rounded bg-purple-500 text-white font-bold px-5 py-2">Start Bingo</button>
            </div>
        </div>
    )
}