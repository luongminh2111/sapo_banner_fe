import * as React from 'react';

import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { BoxStyle, ToolbarStyle } from '../../styles/style';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import SectionService from '../../services/SectionService';
import SectionStatus from '../section/SectionStatus';
import {
  Toolbar,
  Box,
  Button,
  Typography,
  Table,
  TableContainer,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';

type PageInfo = {
  id: number;
  websiteId: number;
  pageName: string;
  pageUrl: string;
};
interface CustomState {
  detail: PageInfo;
}
interface Section {
  id: number;
  code: string;
  desc: string;
  width: number;
  height: number;
  sectionMappingId: number;
  modeHide: number;
  numberHide: number;
}
interface SectionMapping {
  id: number;
  modeHide: number;
  numberHide: number;
  position: string;
  checked: boolean;
}
const UpdateSectionInPage = () => {
  const location = useLocation();
  const state = location.state as CustomState;
  const history = useHistory();
  const userInfo = (typeof localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '') : '');

  const [sectionEnabled, setSectionEnabled] = useState<Section[]>([]);
  const [sectionArray, setSectionArray] = useState<SectionMapping[]>([]);
  const [username, setUsername] = useState();

  const pageId = state.detail;
  useEffect(() => {
    getData();
    setUsername(userInfo.username);
  }, []);

  const getData = () => {
    SectionService.getListSectionInPageByPageId(pageId).then((response) => {
      setSectionEnabled(response.data);
    });
  };
  const saveToSectionMapping = () => {
    sectionArray.map((item) => {
      sectionEnabled.map((temp) => {
        if (temp.id === item.id) {
          if (temp.numberHide !== item.numberHide || temp.modeHide !== item.modeHide) {
            let newItem = {
              id: temp.sectionMappingId,
              sectionId: item.id,
              pageId: pageId,
              modeHide: item.modeHide,
              numberHide: item.numberHide,
              lastModifiedBy: username,
            };
            SectionService.updateSectionMapping(newItem);
          }
        }
      });
    });
    history.goBack();
  };

  return (
    <div>
      <Toolbar variant="dense" style={ToolbarStyle}>
        <Button
          onClick={() => history.goBack()}
          variant="text"
          sx={{
            color: '#637381',
            fontSize: '14px',
            textTransform: 'none',
          }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: '14px', mr: '5px' }} />
          Quay l???i
        </Button>
        <Box sx={{ justifyContent: 'space-between', display: 'inline-flex', gap: 2 }}>
          <Button
            sx={{ minWidth: '100px' }}
            variant="outlined"
            color="error"
            onClick={() => {
              history.goBack();
            }}
          >
            H???y
          </Button>
          <Button
            sx={{ minWidth: '100px' }}
            variant="contained"
            onClick={saveToSectionMapping}
          >
            L??u ch???nh s???a
          </Button>
        </Box>
      </Toolbar>
      {sectionEnabled.length === 0 ? (
        <Box sx={{ m: 3 }} style={BoxStyle}>
          <Typography variant="h5">Ch??a c?? khu v???c</Typography>
        </Box>
      ) : (
        <Box style={BoxStyle} sx={{ m: 3 }}>
          <Typography variant="h5" mb={2}>
            Danh s??ch c??c khu v???c
          </Typography>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#e6e8ea' }}>
                  <TableCell align="center" sx={{ width: '10%' }}>
                    M??
                  </TableCell>
                  <TableCell align="center" sx={{ width: '10%' }}>
                    Id Th??? Div
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ width: '20%', textOverflow: 'ellipsis', overflow: 'hidden' }}
                  >
                    {' '}
                    M?? t???
                  </TableCell>
                  <TableCell align="center" sx={{ width: '15%' }}>
                    ?????nh ngh??a
                  </TableCell>

                  <TableCell align="center" sx={{ width: '15%' }}>
                    Cho ph??p ???n
                  </TableCell>
                  <TableCell align="center" sx={{ width: '15%' }}>
                    S??? l???n ???n
                  </TableCell>
                  <TableCell align="center" sx={{ width: '10%' }}>
                    X??c Nh???n
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sectionEnabled.map((temp, index) => (
                  <SectionStatus
                    key={index}
                    item={temp}
                    sectionArray={sectionArray}
                    setSectionArray={setSectionArray}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </div>
  );
};
export default UpdateSectionInPage;
