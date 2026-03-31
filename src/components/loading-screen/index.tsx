import SpinnerIcon from "../icons/spinner-icon";

// TODO: min height screen/2

export default function LoadingScreen() {
  return (
    <div className='font-serif block relative min-h-dvh'>
      {/* <div className={styles["content"]}> */}
      <div className="absolute top-1/2 left-1/2 -translate-1/2 flex flex-row">
        <SpinnerIcon className="w-7 h-7 mr-4" />
        <div className="font-serif text-2xl">Please wait...</div>
      </div>
    </div>
  );
}
