import React from 'react';
import type { CSSProps, MonthIndices, Value, WeekdayIndices } from '../../types';
interface Props {
  onChangeViewingYear: (year: number) => unknown;
  onChangeViewingMonth: (month: MonthIndices) => unknown;
  onChangenNewSelectedRangeEnd: (date: Date | undefined) => unknown;
  onChangenNewSelectedRangeStart: (date: Date | undefined) => unknown;
  onChangenSelectedRangeStart: (date: Date | undefined) => unknown;
  onChangenSelectedRangeEnd: (date: Date | undefined) => unknown;
  onChangenSelectedMultiDates: (dates: Record<string, Date | undefined>) => unknown;
  onChangenSelectedDate: (dates: Date) => unknown;
  viewingMonth: MonthIndices;
  allowFewerDatesThanRange: boolean;
  skipDisabledDatesInRange: boolean;
  skipWeekendsInRange: boolean;
  viewingYear: number;
  weekStartIndex: WeekdayIndices;
  fixedRangeLength: number;
  selectedDate: Date | undefined;
  selectedRangeStart: Date | undefined;
  selectedRangeEnd: Date | undefined;
  newSelectedRangeStart: Date | undefined;
  newSelectedRangeEnd: Date | undefined;
  isRangeSelectorView: boolean;
  isFixedRangeView: boolean;
  weekendIndices: WeekdayIndices[];
  selectedMultiDates: Record<string, Date | undefined>;
  isMultiSelectorView: boolean;
  isRangeSelectModeOn: boolean;
  setIsRangeSelectModeOn: (on: boolean) => void;
  disableFuture: boolean;
  disablePast: boolean;
  disableToday: boolean;
  lockView: boolean;
  maxAllowedDate?: Date;
  minAllowedDate?: Date;
  highlights: Date[];
  isDisabled: (date: Date) => boolean;
  checkIfWeekend: (date: Date) => boolean;
  today: Date;
  onChange?: (value: Value) => unknown | Promise<unknown>;
  layoutCalcs: CSSProps;
}
declare function DayOfMonthSelectorComponent({
  selectedDate,
  selectedRangeStart,
  selectedRangeEnd,
  newSelectedRangeStart,
  weekStartIndex,
  onChangeViewingYear,
  onChangeViewingMonth,
  newSelectedRangeEnd,
  isRangeSelectorView,
  skipDisabledDatesInRange,
  setIsRangeSelectModeOn,
  fixedRangeLength,
  isFixedRangeView,
  isRangeSelectModeOn,
  isDisabled,
  onChangenSelectedMultiDates,
  selectedMultiDates,
  isMultiSelectorView,
  today,
  viewingMonth,
  onChangenNewSelectedRangeEnd,
  onChangenNewSelectedRangeStart,
  onChangenSelectedRangeEnd,
  onChangenSelectedRangeStart,
  onChangenSelectedDate,
  layoutCalcs,
  weekendIndices,
  onChange,
  viewingYear,
  allowFewerDatesThanRange,
  disableFuture,
  disablePast,
  lockView,
  checkIfWeekend,
  highlights,
  disableToday,
}: Props): JSX.Element;
export declare const DayOfMonthSelector: React.MemoExoticComponent<typeof DayOfMonthSelectorComponent>;
export {};
