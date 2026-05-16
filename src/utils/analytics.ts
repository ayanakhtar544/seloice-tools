export const normalizeText = (text: string | null | undefined): string =>
  String(text ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .substring(0, 150);

export const getToolNameFromPathname = (pathname: string): string | null => {
  const match = pathname.match(/^\/tools\/([^\/\?#]+)/i);
  return match?.[1] ?? null;
};

export const getBlogSlugFromPathname = (pathname: string): string | null => {
  const match = pathname.match(/\/blogs?\/([^\/\?#]+)/i);
  return match?.[1] ?? null;
};

export const isExternalUrl = (href: string, origin: string): boolean => {
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }

  try {
    const url = new URL(href, origin);
    return url.origin !== origin;
  } catch {
    return false;
  }
};

export const getElementText = (element: Element): string => {
  if (element instanceof HTMLInputElement || element instanceof HTMLButtonElement) {
    const controlText =
      element.value ||
      element.textContent ||
      element.getAttribute("aria-label") ||
      element.getAttribute("title");
    return normalizeText(controlText);
  }

  const text =
    element.textContent ||
    element.getAttribute("aria-label") ||
    element.getAttribute("title");
  return normalizeText(text);
};

export const getAnchorText = (element: Element): string => getElementText(element);

export const getElementClasses = (element: Element): string | undefined => {
  const className = typeof element.className === "string" ? element.className : "";
  const normalized = normalizeText(className);
  return normalized || undefined;
};

export const getFormIdentifier = (form: HTMLFormElement): string | undefined => {
  const identifier =
    form.id ||
    form.getAttribute("name") ||
    form.getAttribute("aria-label") ||
    form.getAttribute("action");
  const normalized = normalizeText(identifier);
  return normalized || undefined;
};

export const findSearchInput = (form: HTMLFormElement): HTMLInputElement | null => {
  const candidate = form.querySelector<HTMLInputElement>(
    'input[type="search"], input[name*="search" i], input[name*="query" i], input[name*="q" i], input[placeholder*="search" i]'
  );

  if (candidate && candidate.value.trim().length > 0) {
    return candidate;
  }

  return Array.from(form.querySelectorAll<HTMLInputElement>("input[type=text], input[type=search]"))
    .find((input) => {
      const name = input.name?.toLowerCase() ?? "";
      const placeholder = input.placeholder?.toLowerCase() ?? "";
      return (
        (name.includes("search") || name.includes("query") || name.includes("term") || placeholder.includes("search")) &&
        input.value.trim().length > 0
      );
    }) ?? null;
};

export const isSearchInput = (element: Element | null): element is HTMLInputElement => {
  if (!(element instanceof HTMLInputElement)) return false;

  const type = element.type.toLowerCase();
  const name = element.name?.toLowerCase() ?? "";
  const placeholder = element.placeholder?.toLowerCase() ?? "";
  const id = element.id?.toLowerCase() ?? "";

  return (
    type === "search" ||
    name.includes("search") ||
    name.includes("query") ||
    name === "q" ||
    placeholder.includes("search") ||
    id.includes("search")
  );
};

export const isAuthIntent = (value: string): boolean => {
  const normalized = value.toLowerCase();
  return [
    "signup",
    "sign up",
    "register",
    "create account",
    "join",
    "try now",
    "login",
    "log in",
    "sign in",
    "authenticate",
  ].some((keyword) => normalized.includes(keyword));
};
