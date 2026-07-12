import {
  useState,
  ReactNode,
  createContext,
  SetStateAction,
  Dispatch,
  useContext,
  useEffect,
} from 'react';
export type activeMenuOption = { index: number | null; isMenuActive: boolean };
export type selectedMessageOption =
  | {
      component: ReactNode | undefined;
      props: any;
      messageId: number;
      title: string;
      actionName: string;
    }
  | undefined;
interface IMessageContext {
  activeMenuOption: activeMenuOption;
  setActiveMenuOptions: Dispatch<SetStateAction<activeMenuOption>>;
  closeMessageMenuOptions: () => void;
  messageOptionPortalDisplay: boolean;
  setMessageOptionPortal: Dispatch<SetStateAction<boolean>>;
  selectedMessageOption: selectedMessageOption;
  selectMessageOptionComponent: Dispatch<SetStateAction<selectedMessageOption>>;
  toggleMessageEditing: Dispatch<SetStateAction<boolean>>;
  isEditing: boolean;
  clearActiveMessageMenuOptions: () => void;
}
export const messageContext = createContext<IMessageContext | null>(null);
export const useMessageContext = () => {
  const context = useContext(messageContext);
  if (!context) {
    throw new Error(
      'useMessageContext must be used within a MessageContext provider '
    );
  }
  return context;
};

export default function MessageContext({ children }: { children: ReactNode }) {
  const [activeMenuOption, setActiveMenuOptions] = useState<{
    index: number | null;
    isMenuActive: boolean;
  }>({ index: null, isMenuActive: false });
  const closeMessageMenuOptions = () => {
    setActiveMenuOptions((prev) => ({ ...prev, isMenuActive: false }));
  };
  const clearActiveMessageMenuOptions = () => {
    setActiveMenuOptions({ index: null, isMenuActive: false });
  };

  const [messageOptionPortalDisplay, setMessageOptionPortal] =
    useState<boolean>(false);
  const [selectedMessageOption, selectMessageOptionComponent] =
    useState<selectedMessageOption>();
  const [isEditing, toggleMessageEditing] = useState<boolean>(false);
  useEffect(() => {
    if (selectedMessageOption) {
      clearActiveMessageMenuOptions();
    }
  }, [selectMessageOptionComponent]);
  return (
    <messageContext.Provider
      value={{
        toggleMessageEditing,
        isEditing,
        activeMenuOption,
        setActiveMenuOptions,
        closeMessageMenuOptions,
        setMessageOptionPortal,
        messageOptionPortalDisplay,
        selectedMessageOption,
        selectMessageOptionComponent,
        clearActiveMessageMenuOptions,
      }}
    >
      {children}
    </messageContext.Provider>
  );
}
