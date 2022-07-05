import { useLanguageConstants, getTranslationKey } from "../../../common/language";

function Message({ constantKey, children, args=[] }) {
  const { language, MSG } = useLanguageConstants();
  if (constantKey) {
    return MSG[constantKey]?.replace(/%(\d+)/g, (match, num) =>
      num <= args.length ? args[num - 1] : match
    );
  } else {
    const key = getTranslationKey(children);
    return key ? MSG[key] : children;
  }
}

export default Message;