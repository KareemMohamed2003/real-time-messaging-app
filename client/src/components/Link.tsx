import { LinkProps, Link, Box } from '@mui/material';
import nextLink, { LinkProps as nextLinkProps } from 'next/link';
import React from 'react';
import type { UrlObject } from 'url';

type Url = string | UrlObject | null;
type TLinkProps = LinkProps &
  nextLinkProps & {
    placeholder?: string;
    variant?: string;
    color?: string;
    children?: React.ReactNode;
    href?: any | string;
  };
export default function CustomLink({
  placeholder,
  variant,
  color,
  children,
  href,
}: TLinkProps) {
  return (
    <Link
      variant={variant ? variant : 'h5'}
      underline="none"
      fontWeight="bold"
      color={color ? color : 'rgba(95,95,95)'}
      href={href ? href : undefined}
      component={nextLink}
      textAlign="center"
    >
      {/*<Box sx={{background: "#FFF333", height: 100, width: "100%"}}>item 1</Box>*/}
      {children ? children : null}
      {placeholder ? placeholder : null}
    </Link>
  );
}
