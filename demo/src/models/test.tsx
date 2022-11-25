import { useState } from 'react'
import ScatterData from '../../public/data/data.json'
export default()=>{
    const [data, setData] = useState(ScatterData)
    return{
        data,
        setData,
    }
}