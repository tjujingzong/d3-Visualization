import { useState, useRef } from 'react';
import data from '../../public/data/miserables.json';
export default () => {
    const [s1Data, setS1Data] = useState(data)
    const svg1Ref = useRef<SVGSVGElement>(null)
    const svg2Ref = useRef<SVGSVGElement>(null)

    return {
        s1Data,
        setS1Data,
        svg1Ref,
        svg2Ref
    }
}
