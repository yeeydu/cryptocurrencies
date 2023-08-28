import React, { useState } from "react";


export default function ApiMessage(props: any) {
  //const [message, setMessage] = useState(props);
  //console.log(message);

  return (
      <div className="mb-2">
          <span className="text-right text-info border border-info rounded p-1 mb-1 w-auto ">
            <small>
              This project uses a free API access with limited request per
              minutes. if no content shows, wait a minute...
            </small>
          </span>
    </div>
  );
}
