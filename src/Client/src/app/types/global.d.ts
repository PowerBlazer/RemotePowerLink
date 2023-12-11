declare module '*.scss' {
  type IClassNames = Record<string, string>;
  const classNames: IClassNames;
  export = classNames;
}

declare module '*.png'
declare module '*.jpg'
declare module '*.gif'
declare module '*.svg'{
    const svg: React.FunctionComponent<React.SVGAttributes<SVGAElement>>;
    export default svg;
}

declare const __IS_DEV__: boolean
