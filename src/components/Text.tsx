import React, { Children, forwardRef, useMemo, useRef, useLayoutEffect } from 'react'

import { TextMesh as TextMeshImpl } from 'troika-three-text/dist/troika-three-text.umd'
import { extend, ReactThreeFiber } from '@react-three/fiber'
// @ts-ignore
import mergeRefs from 'react-merge-refs'

extend({ TextMeshImpl })

type TextMesh = ReactThreeFiber.Object3DNode<TextMeshImpl, typeof TextMeshImpl>

declare global {
  namespace JSX {
    interface IntrinsicElements {
      textMeshImpl: TextMesh
    }
  }
}

type Props = JSX.IntrinsicElements['mesh'] & {
  children: React.ReactNode
  color?: ReactThreeFiber.Color
  fontSize?: number
  maxWidth?: number
  lineHeight?: number
  letterSpacing?: number
  textAlign?: 'left' | 'right' | 'center' | 'justify'
  font?: string
  anchorX?: number | 'left' | 'center' | 'right'
  anchorY?: number | 'top' | 'top-baseline' | 'middle' | 'bottom-baseline' | 'bottom'
  clipRect?: [number, number, number, number]
  depthOffset?: number
  overflowWrap?: 'normal' | 'break-word'
  whiteSpace?: 'normal' | 'overflowWrap' | 'overflowWrap'
}

export const Text = forwardRef(({ children, ...props }: Props, ref) => {
  const textRef = useRef<TextMeshImpl>()
  const [nodes, text] = useMemo(() => {
    let n: any = []
    let t = ''
    Children.forEach(children, (child) => {
      if (typeof child === 'string') t += child
      else n.push(child)
    })
    return [n, t]
  }, [children])
  useLayoutEffect(() => void textRef.current.sync())

  return (
    <>
      <textMeshImpl ref={mergeRefs([textRef, ref])} text={text} {...props} castShadow>
        {nodes}
      </textMeshImpl>
    </>
  )
})
