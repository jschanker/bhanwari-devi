import { useLanguageConstants, getTranslationKey } from "../../../common/language";

function Message({ constantKey, children, args=[] }) {
  const { language, MSG } = useLanguageConstants();
  // TODO: This conversion won't work in general, fix with recursive function
  const strArgs =
      args.map(arg => typeof arg === 'string' ? arg : MSG[arg.props?.constantKey]);

  if (constantKey) {
    return MSG[constantKey]?.replace(/%(\d+)/g, (match, num) =>
      num <= strArgs.length ? strArgs[num - 1] : match
    );
  } else {
    const key = getTranslationKey(children);
    return key ? MSG[key] : children;
  }
}

export default Message;