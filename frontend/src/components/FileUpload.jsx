import React from 'react';
import { Button, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';

export default function FileUpload({ file, onChange, accept='application/pdf' }) {
  return (
    <>
      <input
        accept={accept}
        style={{ display: 'none' }}
        id="upload-file"
        type="file"
        onChange={onChange}
      />
      <label htmlFor="upload-file">
        <Button variant="contained" component="span" style={{ marginTop: 16, marginRight: 16 }}>
          {file ? file.name : 'Upload PDF'}
        </Button>
      </label>
      {file && (
        <IconButton sx={{ paddingTop: 4 }} onClick={() => onChange({ target: { files: [] } })}>
          <Delete color="error" />
        </IconButton>
      )}
    </>
  );
}
