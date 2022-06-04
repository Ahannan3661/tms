import React, { ComponentProps } from "react"
import DatePicker from "react-datepicker"
const moment = require('moment-timezone');

interface Props {
  timezone: string
}

const DatePickerWithTimezone = ({
  selected,
  onChange,
  timezone,
  ...props
}: Props & ComponentProps<typeof DatePicker>) => (
  <DatePicker
    selected={selected ? setLocalZone(selected, timezone) : null}
    onChange={(v, e) => {
      onChange(v ? setOtherZone(v, timezone) : null, e)
    }}
    {...props}
  />
)

const setLocalZone = (date: Date, timezone: string) => {
  const dateWithoutZone = moment
    .tz(date, timezone)
    .format("YYYY-MM-DDTHH:mm:ss.SSS")
  const localZone = moment(dateWithoutZone).format("Z")
  const dateWithLocalZone = [dateWithoutZone, localZone].join("")

  return new Date(dateWithLocalZone)
}

const setOtherZone = (date: Date, timezone: string) => {
  const dateWithoutZone = moment(date).format("YYYY-MM-DDTHH:mm:ss.SSS")
  const otherZone = moment.tz(date, timezone).format("Z")
  const dateWithOtherZone = [dateWithoutZone, otherZone].join("")

  return new Date(dateWithOtherZone)
}

export default DatePickerWithTimezone