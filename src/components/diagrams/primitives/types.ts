import type { Hue } from '~/lib/types';

/** Một ô/thẻ trong sơ đồ. `text`, `items` hỗ trợ **đậm**, *nghiêng*. */
export interface Node {
  icon?: string;
  title: string;
  text?: string;
  items?: string[];
  hue?: Hue;
  /** nhãn nhỏ phía trên tiêu đề */
  tag?: string;
}
