import {useState} from 'react'
import PropTypes from 'prop-types'

import Modal from '@/components/common/modal'
import CandidacyForm from './candidacy-form'
import CandidacyInfos from './candidacy-infos'

function CandidacyModal({onClose, partnersServices, departements}) {
  const [showForm, setShowForm] = useState(false)
  const handleConfirm = () => {
    setShowForm(true)
  }

  return (
    <Modal title={showForm ? 'Formulaire de candidature à la charte' : 'Notice d\'information'} onClose={onClose}>
      {showForm ? <CandidacyForm onClose={onClose} partnersServices={partnersServices} departements={departements} /> : <CandidacyInfos onConfirm={handleConfirm} />}
    </Modal>
  )
}

CandidacyModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  partnersServices: PropTypes.array.isRequired,
  departements: PropTypes.array.isRequired
}

export default CandidacyModal
