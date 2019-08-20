
import { createMuiTheme } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

export default createMuiTheme({
  overrides: {
    MuiDialogActions : {
      root : {
        alignContent : 'center',
        alignItems : 'center',
      }
    },
    MuiTableCell: {
      root : {
        fontSize : 30,
        color : 'white',
      },
      head : {
        fontSize : 25,
        color : 'white',
      },
      body : {
        fontSize : 20,
        color : 'white',
      }
    },
    MuiPaper : {
      root : {
      }
    },
    MuiTableRow : {
      root : {
      }
    },
    MuiTable : {
      root : {
        width : '40%'
      }
    },
    MuiButton : {
      root : {}
    }
  }
});