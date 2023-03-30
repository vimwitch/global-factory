declare module 'global-factory' {
  export const globalDeployerAddress: string
  export default function GlobalFactory(factory: any, signer?: any): Promise<any>
}
