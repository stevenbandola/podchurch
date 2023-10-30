import { useThree } from '@react-three/fiber'
// import { useControl } from 'react-three-gui'
import { Text } from '@react-three/drei'
export const ResponsiveText = (value) => {
  const { viewport } = useThree()
  // const color = useControl('color', { type: 'color', value: 'hotpink' })
  // const fontSize = useControl('fontSize', { type: 'number', value: 6, min: 1, max: 10 })
  // const maxWidth = useControl('maxWidth', { type: 'number', value: 90, min: 1, max: 100 })
  // const lineHeight = useControl('lineHeight', { type: 'number', value: 0.75, min: 0.1, max: 10 })
  // const letterSpacing = useControl('spacing', { type: 'number', value: -0.08, min: -0.5, max: 1 })
  // const textAlign = useControl('textAlign', {
  //   type: 'select',
  //   items: ['left', 'right', 'center', 'justify'],
  //   value: 'justify',
  // })

  return (
    // <Text
    //   color={color}
    //   fontSize={fontSize}
    //   maxWidth={(viewport.width / 100) * maxWidth}
    //   lineHeight={lineHeight}
    //   letterSpacing={letterSpacing}
    //   textAlign={textAlign}
    //   font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
    //   anchorX="center"
    //   anchorY="middle">
    //   {value}
    //   <meshStandardMaterial attach="material" />
    // </Text>
    <></>
  )
}
