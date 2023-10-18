import FileInput from '@components/Inputs/FileInput/FileInput';
import { IChatForm } from '@interfaces/IChatForm';

function ChatForm({
  message,
  handleChangeMessage,
  handleManageSendMessage,
}: IChatForm) {
  return (
    <form
      className="absolute bottom-0 left-0 overflow-hidden w-full z-10 flex items-center gap-4 h-20 px-6 border-t"
      onSubmit={handleManageSendMessage}
    >
      <div className="relative w-full h-10 sm:w-8/12 ">
        <input
          autoFocus
          className="w-full h-full py-1 px-10 rounded-3xl bg-mySeacrhBcg text-white outline-none"
          type="text"
          placeholder='Write your message...'
          value={message}
          onChange={handleChangeMessage}
        />
        <FileInput />
      </div>
      <button className="flex justify-center items-center h-12 w-12 bg-transparent hover:bg-hoverGray rounded-full cursor-pointer">
        <svg
          height="25px"
          width="25px"
          version="1.1"
          id="Capa_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 25.951 25.951"
          xmlSpace="preserve"
        >
          <g>
            <path
              style={{ fill: 'rgb(170,170,170)' }}
              d="M3,0.225h18c1.656,0,3,1.344,3,3v10c0,0.313-0.062,0.609-0.15,0.893l-2.056-1.832
		c-0.451-0.457-1.358-0.662-2.078-0.369l-3.692-3.779L23,2.7L12,8.632L1,2.7l6.977,5.438l-5.77,5.906l7.037-5.025L12,10.813
		l2.758-1.795l4.467,3.191c-0.451,0.366-0.725,0.922-0.725,1.531v1.043c-1.135,0.168-2.473,0.565-3.703,1.441H3
		c-1.656,0-3-1.344-3-3V3.225C0,1.569,1.344,0.225,3,0.225z"
            />
            <g>
              <path
                style={{ fill: 'rgb(170,170,170)' }}
                d="M20,13.741v2.434c-3.227,0-7.5,1.564-7.5,9.551c1.412-5.096,3.314-5.488,7.5-5.488v2.473
			c0,0.191,0.105,0.363,0.281,0.437c0.059,0.024,0.121,0.036,0.182,0.036c0.123,0,0.244-0.048,0.334-0.139l5.016-4.504
			c0.184-0.184,0.184-0.484,0-0.668l-5.016-4.465c-0.135-0.135-0.34-0.176-0.516-0.103S20,13.549,20,13.741z"
              />
            </g>
          </g>
        </svg>
      </button>
    </form>
  );
}

export default ChatForm;
