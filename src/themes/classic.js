import {
    blueGrey500,
    blueGrey700,
    cyan500,
    fullBlack,
    grey300,
    grey400,
    grey900,
    orange500,
    orange700,
    white
} from 'material-ui/colors'

import Spacing from 'material-ui/styles/spacing'

export default {
    spacing: Spacing,
    fontFamily: 'Roboto, sans-serif',
    palette: {
        primary1Color: '#F6AE2D',
        primary2Color: blueGrey700,
        primary3Color: blueGrey700,
        accent1Color: orange500,
        accent2Color: orange700,
        accent3Color: orange700,
        textColor: grey900,
        alternateTextColor: grey300,
        canvasColor: white,
        borderColor: grey400,
        pickerHeaderColor: cyan500,
        shadowColor: fullBlack,
        bgColor: 'snow'
    },
    overrides: {
        MuiAppBar: {
            root: {
                border: 'none!important',
            },
            colorPrimary: {
                backgroundColor: '#042146'
            }
        },
        MuiCardContent: {
          root: {
              background: 'white'
          }
        },
        MuiTab: {
            rootInherit: {
                minWidth: 130
            }
        },
        MuiPaper: {
          root: {
              backgroundColor: 'snow',
              boxShadow: 'none!important',
              border: '1px solid #D9DEE4'
          }
        },
        MuiTabIndicator: {
            colorSecondary: {
                backgroundColor: '#F6AE2D'
            }
        },
        MuiButton: {
            raisedPrimary: {
                backgroundColor: '#F6AE2D',
                '&:hover': {
                    backgroundColor: '#E69E1D'
                }
            },
            raised: {
                boxShadow: 'none'
            }
        },
        MuiBackdrop: {
            root: {
                zIndex: 1
            }
        },
        MuiPopover: {
            paper: {
                zIndex: 3
            }
        }
    }
}