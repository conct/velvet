import { useWindowDimensions } from "react-native";

/**
 * Ab dieser Breite behandeln wir ein Gerät als Tablet. 768pt ist die schmalste
 * iPad-Seite und liegt deutlich über jedem Telefon im Hochformat.
 */
export const TABLET_MIN_WIDTH = 768;

/**
 * Breite, auf die Inhalte auf Tablets begrenzt werden. Ohne diese Grenze laufen
 * Buttons und Texte über die volle iPad-Breite und die Seite wirkt wie ein
 * gestrecktes Telefon-Layout.
 */
export const TABLET_CONTENT_WIDTH = 520;

export function useIsTablet() {
  const { width } = useWindowDimensions();
  return width >= TABLET_MIN_WIDTH;
}
