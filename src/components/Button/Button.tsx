import styles from './Button.module.css';
import { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary';

type BaseProps = {
  variant?: Variant;
  fullWidth?: boolean;
};

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };

type ButtonAsLink = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = 'primary',
  fullWidth = false,
  className,
  ...props
}: ButtonProps) {
  const cls = [
    styles.btn,
    styles[variant],
    fullWidth ? styles.fullWidth : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  if ('href' in props && props.href) {
    return <a className={cls} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)} />;
  }

  return <button className={cls} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)} />;
}
