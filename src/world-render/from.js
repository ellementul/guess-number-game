import { Graphics } from '@pixi/graphics';
import { Input } from '@pixi/ui';

export const Form = ({
  text,
  border,
  textColor,
  fontSize,
  backgroundColor,
  borderColor,
  width,
  height,
  radius,
  maxLength,
  align,
  placeholder,
  paddingTop,
  paddingRight,
  paddingBottom,
  paddingLeft,
  onChange
}) =>
{
  // const view = new List({ type: 'vertical', elementsMargin: 10 });
  const input = new Input({
    bg: new Graphics()
        .beginFill(borderColor)
        .drawRoundedRect(0, 0, width, height, radius + border)
        .beginFill(backgroundColor)
        .drawRoundedRect(border, border, width - (border * 2), height - (border * 2), radius),
    textStyle: {
        fill: textColor,
        fontSize,
        fontWeight: 'bold'
    },
    maxLength,
    align,
    placeholder,
    value: text,
    padding: [paddingTop, paddingRight, paddingBottom, paddingLeft]
  });
  // Center bunny sprite in local container coordinates
  input.pivot.x = input.width / 2;
  input.pivot.y = input.height / 2;

  input.onEnter.connect((val) => onChange(`Input ${i + 1} (${val})`));
  
  return input;
};