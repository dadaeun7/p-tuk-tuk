declare module "*.json" {
  const value: unknown;
  export default value;
}

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}