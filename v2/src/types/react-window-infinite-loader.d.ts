declare module 'react-window-infinite-loader' {
  import { Component, ReactElement, MutableRefObject } from 'react'
  import { ListOnItemsRenderedProps } from 'react-window'

  export interface InfiniteLoaderProps {
    isItemLoaded: (index: number) => boolean
    itemCount: number
    loadMoreItems: (startIndex: number, stopIndex: number) => Promise<void>
    children: (props: {
      onItemsRendered: (props: ListOnItemsRenderedProps) => void
      ref: MutableRefObject<any>
    }) => ReactElement
  }

  export default class InfiniteLoader extends Component<InfiniteLoaderProps> {}
}