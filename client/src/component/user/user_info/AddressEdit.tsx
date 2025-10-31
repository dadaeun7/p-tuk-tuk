import { useState } from "react";
import { BACK, localUser, modifyUser } from "../../../config";
import DaumPostcode, { type Address } from 'react-daum-postcode';
import { useAuth } from "../../../contexts/Auth";
import { useMyModal } from "../../../contexts/MyModal";



function AddressEdit() {

  const { user } = useAuth();
  const [address, setAddress] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { openModal } = useMyModal();


  const resultPopUp = ({ msg }: { msg: string }) => {
    openModal(<div>{msg}</div>);
  }

  const selectAddressComplete = (addr: Address) => {
    const selectAddress = `${addr.sido} ${addr.sigungu}`;

    setAddress(selectAddress);
    submitAddress(selectAddress);
    setIsOpen(false);
  }

  const submitAddress = async (address: string) => {

    const myId = user?.myId;
    const ADDRESS_API = `/users/${myId}/address`;

    await fetch(`${BACK}${ADDRESS_API}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address })
    }).then((data) => {
      return data.json();
    }).then((res) => {

      const msgPopUp = res.message;
      resultPopUp({ msg: msgPopUp });
      modifyUser(address, 'location');

      window.location.reload();
    }).catch((err) => {
      resultPopUp(err);
    })
  }

  return (
    <>
      <div
        className="user-address-edit"
        style={{ cursor: "pointer" }}
        onClick={() => { setIsOpen(!isOpen); }}
      >
        {localUser().location === "" ? "주소 등록하기" : "주소 변경하기"}
      </div>
      {isOpen && <DaumPostcode onComplete={selectAddressComplete} />}
    </>

  );
}

export default AddressEdit;
