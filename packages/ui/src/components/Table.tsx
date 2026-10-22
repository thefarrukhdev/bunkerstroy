import React from 'react';
import { Package } from 'lucide-react';
import { cn } from '../utils';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  wrapperClassName?: string;
}

export const Table: React.FC<TableProps> = ({ className, wrapperClassName, children, ...props }) => {
  return (
    <div
      className={cn(
        'w-full overflow-x-auto rounded-xl border border-bunker-border-strong bg-bunker-surface-1 shadow-xs',
        wrapperClassName
      )}
    >
      <table className={cn('w-full text-left border-collapse text-xs font-mono', className)} {...props}>
        {children}
      </table>
    </div>
  );
};

export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const TableHeader: React.FC<TableHeaderProps> = ({ className, children, ...props }) => {
  return (
    <thead
      className={cn(
        'bg-bunker-surface-2 text-bunker-text-secondary border-b border-bunker-border-strong font-mono uppercase text-[11px] tracking-wider font-semibold',
        className
      )}
      {...props}
    >
      {children}
    </thead>
  );
};

export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const TableBody: React.FC<TableBodyProps> = ({ className, children, ...props }) => {
  return (
    <tbody className={cn('divide-y divide-bunker-border-subtle bg-bunker-surface-1', className)} {...props}>
      {children}
    </tbody>
  );
};

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  isClickable?: boolean;
}

export const TableRow: React.FC<TableRowProps> = ({ className, isClickable = false, children, ...props }) => {
  return (
    <tr
      className={cn(
        'transition-colors border-b border-bunker-border-subtle',
        isClickable ? 'cursor-pointer hover:bg-bunker-surface-hover' : 'hover:bg-bunker-surface-hover/70',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
};

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {}

export const TableHead: React.FC<TableHeadProps> = ({ className, children, ...props }) => {
  return (
    <th className={cn('p-3.5 font-semibold text-bunker-text-secondary select-none whitespace-nowrap', className)} {...props}>
      {children}
    </th>
  );
};

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

export const TableCell: React.FC<TableCellProps> = ({ className, children, ...props }) => {
  return (
    <td className={cn('p-3.5 text-bunker-text-primary whitespace-nowrap', className)} {...props}>
      {children}
    </td>
  );
};

export interface TableEmptyProps {
  colSpan: number;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export const TableEmpty: React.FC<TableEmptyProps> = ({
  colSpan,
  icon,
  title = "Ma'lumot topilmadi",
  description = "Qidiruv parametrlarini o'zgartirib ko'ring",
  className
}) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className={cn('py-16 text-center text-bunker-text-muted', className)}>
        <div className="flex flex-col items-center justify-center space-y-2">
          {icon || <Package className="w-10 h-10 text-bunker-text-muted/50 mb-1" />}
          <p className="font-semibold text-bunker-text-secondary text-sm">{title}</p>
          <p className="text-xs text-bunker-text-muted">{description}</p>
        </div>
      </TableCell>
    </TableRow>
  );
};
