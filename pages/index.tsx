import Head from 'next/head'
import React, { useState } from 'react';
import { Modal, Box, FormControl, InputLabel, Input, FormHelperText, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import * as APIService from '../apiServices';

import styles from '@/pages/index.module.css'

const modalBoxStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const emailValidRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export default function Home() {
  // modal props
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

  const reset = () => {
    setFullName('');
    setEmail('');
    setConfirmEmail('');

    setErrorFullName(false);
    setErrorEmail(false);
    setErrorConfirmEmail(false);

    setSuccess(false);
    setErrorStatusText('');
    setIsLoading(false);
  }

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  // modal validation states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');

  const [errorFullName, setErrorFullName] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorConfirmEmail, setErrorConfirmEmail] = useState(false);

  // modal response states
  const [errorStatusText, setErrorStatusText] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // input handlers
  const handleFullNameChange = (e: any) => {
    setFullName(e.target.value);
    setErrorFullName(e.target.value.length < 3);
  }

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
    setErrorEmail(!e.target.value.match(emailValidRegex))
    setErrorConfirmEmail(confirmEmail !== '' && e.target.value !== confirmEmail)
  }

  const handleConfirmEmail = (e: any) => {
    setConfirmEmail(e.target.value);
    setErrorConfirmEmail(e.target.value !== email)
  }

  // request
  const handleSend = async () => {
    let flag = false;
    // validation
    if (fullName.length < 3) {
      setErrorFullName(true);
      flag = true;
    }
    if (!email.match(emailValidRegex)) {
      setErrorEmail(true);
      flag = true;
    }
    if (email !== confirmEmail) {
      setErrorConfirmEmail(true);
      flag = true;
    }

    if(flag) {
      return;
    }

    // send the request
    setIsLoading(true);
    try {
      const response = await APIService.register(fullName, email);
      if (response?.status == 200) {
        setSuccess(true);
      }
    } catch (error: any) {
      if (error?.response?.status == 400) {
        setErrorStatusText(error?.response?.data?.errorMessage || 'request error');
      }
    } finally {
      setIsLoading(false);
    }
  }

  const ModalContent = () => success ? (
    <div className={styles.flexColumn}>
      <Typography className={styles.italic} id="modal-modal-title" variant="h6" component="h2">
        All done!
      </Typography>
      <div className={styles.shortLine}></div>
      <p aria-label="ok-message">You will be one of the first to experience Broccoli & Co. when we launch.</p>
      <button aria-label="ok-button" className={styles.button} onClick={handleClose}>OK</button>
    </div>
  ) : (
    <div className={styles.flexColumn}>
      <Typography className={styles.italic} id="modal-modal-title" variant="h6" component="h2">
        Request an invite
      </Typography>
      <div className={styles.shortLine}></div>
      <FormControl error={errorFullName} variant="standard">
        <InputLabel htmlFor="full-name">Full Name</InputLabel>
        <Input
          id="full-name"
          aria-label="full-name-input"
          onChange={handleFullNameChange}
        />
        {errorFullName ? <FormHelperText aria-label="full-name-error-text">At least 3 characters</FormHelperText> : null}
      </FormControl>

      <FormControl error={errorEmail} variant="standard">
        <InputLabel htmlFor="email">Email</InputLabel>
        <Input
          id="email"
          aria-label="email-input"
          onChange={handleEmailChange}
        />
        {errorEmail ? <FormHelperText aria-label="email-error-text">Invalid Email Format</FormHelperText> : null}
      </FormControl>

      <FormControl error={errorConfirmEmail} variant="standard">
        <InputLabel htmlFor="confirm-email">Confirm Email</InputLabel>
        <Input
          id="confirm-email"
          aria-label="confirm-email-input"
          onChange={handleConfirmEmail}
        />
        {errorConfirmEmail ? <FormHelperText aria-label="confirm-email-error-text">Email doesn't match</FormHelperText> : null}
      </FormControl>

      <button aria-label="send-button" disabled={isLoading} className={styles.button} onClick={handleSend}>{isLoading ? 'Sending, please wait..' : 'Send'}</button>

      {errorStatusText.length > 0 ? <div className={styles.red} aria-label='error-status-text'>{errorStatusText}</div> : null}
    </div>
  )

  return (
    <div className={styles.container}>
      <Head>
        <title>BROCCOLI & CO.</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header aria-label="header">
        BROCCOLI & CO.
      </header>

      <main>
        <div className={styles.title}>
          A better way
        </div>
        <div className={styles.title}>
          to enjoy every day.
        </div>

        <p className={styles.description}>
          Be the first to know when we launch.
        </p>

        <button aria-label='invite button' className={styles.button} onClick={handleOpen}>Request an invite</button>
      </main>

      <footer>
        <div>Made with <FavoriteIcon sx={{ fontSize: 10 }} /> in Melbourne </div>
        <div>@ 2016 Broccoli & Co. All rights reserved.</div>
      </footer>

      <Modal
        open={open}
        onClose={handleClose}
        aria-label="invite-modal-title"
        aria-describedby="invite-modal-description"
      >
        <Box sx={modalBoxStyle}>
          {ModalContent()}
        </Box>
      </Modal>
    </div>
  )
}
