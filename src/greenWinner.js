
import { createMuiTheme } from "@material-ui/core/styles";

export default createMuiTheme({
  overrides: {
    MuiTableCell : {
        root : {
          width: 20,
        },
        head : {
          color : 'white',
        },
        body : {
          fontSize : 20,
          color : 'red',
        }
    }
  }
});