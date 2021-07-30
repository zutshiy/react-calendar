import React, { memo, useCallback, useMemo, useState } from 'react';

import type { CSSProps, DayOfMonthCell, MonthIndices, Value, WeekdayIndices } from '../../utils/types';

import {
  addDays,
  getDaysOfMonthViewMetrix,
  getNextDate,
  isBefore,
  isEqual,
  isValid,
  toString,
} from '../../utils/date-utils';

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
  inFocus: boolean;
  onChangeFocusedDate: (date: Date) => unknown;
  focusedDate: Date;
  today: Date;
  onChange?: (value: Value) => unknown | Promise<unknown>;
  layoutCalcs: CSSProps;
}

function DayOfMonthSelectorComponent({
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
  inFocus,
  onChangeFocusedDate,
  focusedDate,
}: Props) {
  const [highlightsMap] = useState<Record<string, 1>>(() => {
    if (Array.isArray(highlights)) {
      return highlights
        .filter((d) => isValid(d))
        .reduce((acc, curr) => {
          acc[toString(curr)] = 1;
          return acc;
        }, {} as Record<string, 1>);
    }
    return {};
  });

  const daysOfMMonthViewMatrix = useMemo(() => {
    return getDaysOfMonthViewMetrix({
      selectedDate: selectedDate,
      selectedRangeStart: selectedRangeStart,
      selectedRangeEnd: selectedRangeEnd,
      newSelectedRangeStart: newSelectedRangeStart,
      newSelectedRangeEnd: newSelectedRangeEnd,
      checkIfWeekend,
      isRangeView: isRangeSelectorView || isFixedRangeView,
      isRangeSelectModeOn,
      weekendIndexes: weekendIndices,
      selectedMultiDates,
      highlightsMap,
      isSelectMultiDate: isMultiSelectorView,
      yearInView: viewingYear,
      monthInView: viewingMonth,
      startOfTheWeek: weekStartIndex,
      disableFuture,
      disablePast,
      disableToday,
      isDisabled,
    });
  }, [
    selectedDate,
    selectedRangeStart,
    selectedRangeEnd,
    newSelectedRangeStart,
    newSelectedRangeEnd,
    isRangeSelectorView,
    isFixedRangeView,
    isRangeSelectModeOn,
    checkIfWeekend,
    weekendIndices,
    selectedMultiDates,
    highlightsMap,
    isMultiSelectorView,
    viewingYear,
    viewingMonth,
    weekStartIndex,
    disableFuture,
    disablePast,
    disableToday,
    isDisabled,
  ]);

  const onDateClicked = useCallback(
    (cell: DayOfMonthCell) => {
      const clickedDate = cell.date;

      const cantSelectAsItsLocked = lockView && clickedDate.getMonth() !== viewingMonth;

      if (cantSelectAsItsLocked) {
        return;
      }

      if (isRangeSelectorView && !isFixedRangeView) {
        if (isRangeSelectModeOn && newSelectedRangeStart) {
          // check if it is the first click or seconds

          const previouslySelectedDate = new Date(
            newSelectedRangeStart.getFullYear(),
            newSelectedRangeStart.getMonth(),
            newSelectedRangeStart.getDate(),
          );

          if (isBefore(previouslySelectedDate, clickedDate)) {
            onChangenSelectedRangeStart(clickedDate);
            onChangenSelectedRangeEnd(previouslySelectedDate);

            const startDate = clickedDate;

            const endDate = previouslySelectedDate;

            onChange && onChange([startDate, endDate]);
          } else {
            onChangenSelectedRangeStart(previouslySelectedDate);

            onChangenSelectedRangeEnd(clickedDate);

            const startDate = previouslySelectedDate;

            const endDate = clickedDate;

            onChange && onChange([startDate, endDate]);
          }

          onChangenNewSelectedRangeEnd(undefined);

          setIsRangeSelectModeOn(false);
        } else {
          // select first date
          onChangenNewSelectedRangeStart(clickedDate);

          onChangenNewSelectedRangeEnd(undefined);

          setIsRangeSelectModeOn(true);
        }
      } else if (isFixedRangeView) {
        onChangenSelectedRangeStart(clickedDate);
        const { endDate, limitReached } = addDays(clickedDate, fixedRangeLength, {
          isDisabled,
          skipDisabledDatesInRange,
          upperLimit: lockView
            ? new Date(clickedDate.getFullYear(), clickedDate.getMonth() + 1, 1)
            : disableFuture
            ? getNextDate(today)
            : undefined,
        });

        if (limitReached && !allowFewerDatesThanRange) {
          onChangenSelectedRangeStart(undefined);
          onChangenSelectedRangeEnd(undefined);
        } else {
          onChangenSelectedRangeEnd(endDate);
          onChange && onChange([clickedDate, endDate]);
        }
      } else if (isMultiSelectorView) {
        const stringkey = toString(clickedDate);
        const newselectedMultiDates = { ...selectedMultiDates };

        if (!!selectedMultiDates[stringkey]) {
          newselectedMultiDates[stringkey] = undefined;
        } else {
          newselectedMultiDates[stringkey] = clickedDate;
        }

        onChangenSelectedMultiDates(newselectedMultiDates);

        onChange &&
          onChange(
            Object.keys(newselectedMultiDates)
              .filter((dk) => !!newselectedMultiDates[dk])
              .map((dk) => newselectedMultiDates[dk] as Date),
          );
      } else {
        onChangenSelectedDate(clickedDate);
        onChangeFocusedDate(clickedDate);
        onChange && onChange(clickedDate);
      }

      onChangeViewingMonth(cell.month);
      onChangeViewingYear(cell.year);
    },
    [
      lockView,
      viewingMonth,
      isRangeSelectorView,
      isFixedRangeView,
      isMultiSelectorView,
      onChangeViewingMonth,
      onChangeViewingYear,
      isRangeSelectModeOn,
      newSelectedRangeStart,
      onChangenNewSelectedRangeEnd,
      setIsRangeSelectModeOn,
      onChangenSelectedRangeStart,
      onChangenSelectedRangeEnd,
      onChange,
      onChangenNewSelectedRangeStart,
      fixedRangeLength,
      isDisabled,
      skipDisabledDatesInRange,
      disableFuture,
      today,
      allowFewerDatesThanRange,
      selectedMultiDates,
      onChangenSelectedMultiDates,
      onChangenSelectedDate,
    ],
  );

  // useEffect(() => {
  //   const hasFocus = inFocus;

  //   if (!hasFocus) {
  //     return;
  //   }

  //   function onKeyPress(e: KeyboardEvent) {
  //     console.log('keypress');
  //     switch (e.key) {
  //       case 'ArrowLeft':
  //         onChangeFocusedDate(getPrevDate(focusedDate));
  //         break;
  //       case 'ArrowRight':
  //         onChangeFocusedDate(getNextDate(focusedDate));
  //         break;
  //       case 'ArrowUp':
  //         onChangeFocusedDate(subtractDays(focusedDate, 7).endDate);
  //         break;
  //       case 'ArrowDown':
  //         onChangeFocusedDate(addDays(focusedDate, 7).endDate);
  //         break;
  //     }
  //     e.stopPropagation();
  //   }

  //   console.log('registering'), window.addEventListener('keyup', onKeyPress);

  //   return () => {
  //     console.log('deregistering'), window.removeEventListener('keyup', onKeyPress);
  //   };
  // }, [inFocus, onChangeFocusedDate, focusedDate]);

  return (
    <div style={layoutCalcs.dayOfMonth['arc_view-days-of-month']} className="arc_view-days-of-month" role="grid">
      {daysOfMMonthViewMatrix.map((row, index) => (
        <div style={layoutCalcs.dayOfMonth.arc_view_row} className="arc_view_row" key={index}>
          {row.map((cell) => (
            <div
              style={layoutCalcs.dayOfMonth.arc_view_cell}
              onMouseEnter={() => {
                if (isRangeSelectorView) {
                  if (isRangeSelectModeOn) {
                    onChangenNewSelectedRangeEnd(new Date(cell.year, cell.month, cell.dayOfMonth));
                  }
                }
              }}
              key={cell.dayOfMonth}
              className={`arc_view_cell${cell.activeMonthInView ? ' arc_active' : ''}${
                cell.isWeekend ? ' arc_wknd' : ''
              }${cell.isToday ? ' arc_today' : ''}${cell.isFirstRow ? ' arc_fr' : ''}${
                cell.isToday ? ' arc_today' : ''
              }${cell.isHighlight ? ' arc_highlight' : ''}${cell.isLastRow ? ' arc_lr' : ''}${
                cell.isFirsColumn ? ' arc_fc' : ''
              }${cell.isLastColumn ? ' arc_lc' : ''}${cell.isSelected && !isRangeSelectorView ? ' arc_selected' : ''}${
                cell.isDisabled ? ' arc_disabled' : ''
              }${cell.isInRange ? ' arc_in_range' : ''}${cell.isRangeStart ? ' arc_range_start' : ''}${
                cell.isRangeEnd ? ' arc_range_end' : ''
              }${isRangeSelectModeOn ? ' arc_range_mode' : ''}${
                inFocus && isEqual(cell.date, focusedDate) ? ' arc_focused' : ''
              }`}
            >
              <div style={layoutCalcs.dayOfMonth.arc_view_cell_value} className="arc_view_cell_value">
                <button
                  autoFocus={inFocus && isEqual(cell.date, focusedDate)}
                  style={layoutCalcs.dayOfMonth.arc_view_cell_value_button}
                  disabled={cell.isDisabled}
                  tabIndex={-1}
                  onClick={() => onDateClicked(cell)}
                >
                  {cell.dayOfMonth}
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export const DayOfMonthSelector = memo(DayOfMonthSelectorComponent);
