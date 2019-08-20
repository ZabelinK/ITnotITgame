
import { createMuiTheme } from "@material-ui/core/styles";

export default createMuiTheme({
  overrides: {
    MuiTableCell: {
      root : {
        color : 'white',
      },
      head : {
        fontSize : 25,
        color : 'white',
      },
      body : {        
        fontSize : 20,
        color : 'red',
      }
    },
    MuiTable : {
      root : {
        width : '40%'
      }
    }
  }
});