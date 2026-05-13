declare module "next" {
  export type Metadata = Record<string, unknown>;
  export type Viewport = Record<string, unknown>;
  export type NextConfig = Record<string, unknown>;
}

declare module "next/navigation" {
  export function redirect(path: string): never;
  export function notFound(): never;
  export function usePathname(): string;
  export function useRouter(): {
    refresh(): void;
    push(path: string): void;
    replace(path: string): void;
    back(): void;
  };
}

declare module "next/link" {
  import type { AnchorHTMLAttributes, ReactNode } from "react";

  type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    children?: ReactNode;
  };

  export default function Link(props: LinkProps): ReactNode;
}

declare module "next/server" {
  export class NextURL extends URL {
    pathname: string;
    clone(): NextURL;
  }

  export class NextRequest extends Request {
    nextUrl: NextURL;
    cookies: {
      getAll(): Array<{ name: string; value: string }>;
      set(name: string, value: string): void;
    };
  }

  export class NextResponse extends Response {
    static next(init?: { request?: NextRequest }): NextResponse;
    static redirect(url: string | URL): NextResponse;
    cookies: {
      getAll(): Array<{ name: string; value: string }>;
      set(name: string, value: string, options?: unknown): void;
      setAll?(cookies: Array<{ name: string; value: string }>): void;
    };
  }
}

declare module "next/font/local" {
  export default function localFont(config: Record<string, unknown>): {
    variable: string;
    className?: string;
  };
}

declare module "next/form" {
  import type { FormHTMLAttributes, ReactNode } from "react";

  type FormProps = FormHTMLAttributes<HTMLFormElement> & {
    action?: unknown;
    children?: ReactNode;
  };

  export default function Form(props: FormProps): ReactNode;
}
