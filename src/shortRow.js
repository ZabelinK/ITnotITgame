
import { createMuiTheme } from "@material-ui/core/styles";

export default createMuiTheme({
  overrides: {
    MuiTableCell : {
        root : {
            width: 20,
        },
        head : {
          fontSize : 25,
          color : 'white',
        },
        body : {
          fontSize : 20,
          color : 'white',
        }
    }
  }
});