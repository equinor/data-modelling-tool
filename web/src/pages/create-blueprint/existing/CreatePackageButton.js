import useToggle from '../../../components/hooks/useToggle'
import React from 'react'
import Modal from '../../../components/modal/Modal'

export const CreatePackageButton = () => {
  const [open, setOpen] = useToggle(false)
  return (
    <React.Fragment>
      <button type="button" onClick={() => setOpen()}>
        Create Root Package
      </button>

      {open && (
        <Modal open={open} toggle={setOpen}>
          Jsonform
        </Modal>
      )}
    </React.Fragment>
  )
}
