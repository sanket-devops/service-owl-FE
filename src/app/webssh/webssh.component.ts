import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import {ConstantService} from '../service/constant.service';
// import { WebsshService } from '../service/webssh.service';
import axios from 'axios';

declare let $: any;
declare let toastr: any;
declare let Terminal: any;
declare let FitAddon: any;
let wssh: any = {};

@Component({
  selector: 'app-webssh',
  templateUrl: './webssh.component.html',
  styleUrls: ['./webssh.component.scss']
})
export class WebsshComponent implements OnInit {
  form: FormGroup;

  constructor(public router: Router, public formbuilder: FormBuilder, public constantService: ConstantService) {
    this.form = this.formbuilder.group({
      hostname: ['10.0.2.101'],
      port: [22],
      username: ['root'],
      password: [''],
      privatekey: [''],
      privatekeyfile: [''],
      passphrase: [''],
      totp: ['']
    });
  }

  ngOnInit(): void {
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.form.value.privatekey = e.target.result;
    };
    reader.readAsText(file);
  }

  async getWebsshID() {
    if (this.form.invalid) return;
    let formValue: any = this.form.value;

    try {
      if (formValue.hostname && formValue.port && formValue.username && (formValue.password || formValue.privatekey)) {
        let res: any;
        let headers: any = {
          'Content-Type': 'multipart/form-data'
        };
        const promise = new Promise((resolve, reject) => {

          axios.post(this.constantService.get_webssh_url(this.constantService.WEB_SSH_ENDPOINT), formValue, {
            headers: headers
          })
            .then((response: any) => {
              res = response.data
              resolve(res)
            })
            .catch((error: any) => {
              console.error(error);
              reject(error);
            });
        });

        promise.then(response => {
          // console.log(response);
          this.connectWS(response);
          // return response;
        }).catch(error => {
          console.log(error);
        })
        toastr.success('WebSSH Terminal Requested...');
      } else {
        toastr.warning('Data Invalid...');
      }
    } catch (e) {
      console.log(e);
    }
  }

  async connectWS(msg: any) {

    var status = $('#status'),
    button = $('.btn-primary'),
    form_container = $('.form-container'),
    waiter = $('#waiter'),
    term_type = $('#term'),
    style: any = {},
    default_title = 'WebSSH',
    title_element: any = document.querySelector('title'),
    form_id = '#connect',
    // custom_font = document.fonts ? document.fonts.values().next().value : undefined,
    default_fonts: any,
    DISCONNECTED = 0,
    CONNECTING = 1,
    CONNECTED = 2,
    state = DISCONNECTED,
    messages: any = {1: 'This client is connecting ...', 2: 'This client is already connnected.'},
    key_max_size = 16384,
    fields = ['hostname', 'port', 'username'],
    form_keys = fields.concat(['password', 'totp']),
    opts_keys = ['bgcolor', 'title', 'encoding', 'command', 'term', 'fontsize', 'fontcolor'],
    url_form_data = {},
    url_opts_data: any = {
      bgcolor: '',
      fontcolor: '',
      fontsize: '',
      encoding: ''
    },
    validated_form_data: any,
    event_origin,
    hostname_tester = /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))|(^\s*((?=.{1,255}$)(?=.*[A-Za-z].*)[0-9A-Za-z](?:(?:[0-9A-Za-z]|\b-){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|\b-){0,61}[0-9A-Za-z])?)*)\s*$)/;

    function parse_xterm_style() {
      var text = $('.xterm-helpers style').text();
      var arr = text.split('xterm-normal-char{width:');
      style.width = parseFloat(arr[1]);
      arr = text.split('div{height:');
      style.height = parseFloat(arr[1]);
    }

    function get_cell_size(term: any) {
      style.width = term._core._renderService._renderer.dimensions.actualCellWidth;
      style.height = term._core._renderService._renderer.dimensions.actualCellHeight;
    }

    function toggle_fullscreen(term: any) {
      $('#terminal .terminal').toggleClass('fullscreen');
      term.fitAddon.fit();
    }

    function current_geometry(term: any) {
      if (!style.width || !style.height) {
        try {
          get_cell_size(term);
        } catch (TypeError) {
          parse_xterm_style();
        }
      }

      var cols: any = parseInt((window.innerWidth / style.width).toString(), 10) - 1;
      var rows: any = parseInt((window.innerHeight / style.height).toString(), 10);
      return {'cols': cols, 'rows': rows};
    }

    function resize_terminal(term: any) {
      var geometry = current_geometry(term);
      term.on_resize(geometry.cols, geometry.rows);
    }

    function set_backgound_color(term: any, color: any) {
      term.setOption('theme', {
        background: color
      });
    }

    function set_font_color(term: any, color: any) {
      term.setOption('theme', {
        foreground: color
      });
    }

    function reset_font_family(term: any) {
      if (!term.font_family_updated) {
        console.log('Already using default font family');
        return;
      }

      if (default_fonts) {
        term.setOption('fontFamily',  default_fonts);
        term.font_family_updated = false;
        console.log('Using default font family ' + default_fonts);
      }
    }

    function format_geometry(cols: any, rows: any) {
      return JSON.stringify({'cols': cols, 'rows': rows});
    }

    function read_as_text_with_decoder(file: any, callback: any, decoder: any) {
      var reader = new window.FileReader();

      if (decoder === undefined) {
        decoder = new window.TextDecoder('utf-8', {'fatal': true});
      }

      reader.onload = function() {
        var text;
        try {
          text = decoder.decode(reader.result);
        } catch (TypeError) {
          console.log('Decoding error happened.');
        } finally {
          if (callback) {
            callback(text);
          }
        }
      };

      reader.onerror = function (e) {
        console.error(e);
      };

      reader.readAsArrayBuffer(file);
    }

    function read_as_text_with_encoding(file: any, callback: any, encoding: any) {
      var reader = new window.FileReader();

      if (encoding === undefined) {
        encoding = 'utf-8';
      }

      reader.onload = function() {
        if (callback) {
          callback(reader.result);
        }
      };

      reader.onerror = function (e) {
        console.error(e);
      };

      reader.readAsText(file, encoding);
    }

    function read_file_as_text(file: any, callback: any, decoder: any) {
      if (!window.TextDecoder) {
        read_as_text_with_encoding(file, callback, decoder);
      } else {
        read_as_text_with_decoder(file, callback, decoder);
      }
    }

    function reset_wssh() {
      var name: any;

      for (name in wssh) {
        if (wssh.hasOwnProperty(name) && name !== 'connect') {
          delete wssh[name];
        }
      }
    }

    let ws_url = this.constantService.WEB_SSH_ENDPOINT.split(/\?|#/, 1)[0].replace('http', 'ws'),
    join = (ws_url[ws_url.length-1] === '/' ? '' : '/'),
    url = ws_url + join + 'ws?id=' + await msg.id,
    sock: any = new window.WebSocket(url),
    encoding: any = 'utf-8',
    decoder = window.TextDecoder ? new window.TextDecoder(encoding) : encoding,
    terminal = document.getElementById('terminal'),
    termOptions: any = {
      cursorBlink: true,
      theme: {
        background: url_opts_data.bgcolor || 'black',
        foreground: url_opts_data.fontcolor || 'white'
      }
    };

    if (url_opts_data.fontsize) {
      var fontsize = window.parseInt(url_opts_data.fontsize);
      if (fontsize && fontsize > 0) {
        termOptions.fontSize = fontsize;
      }
    }

    var term: any = new Terminal(termOptions);

    term.fitAddon = new FitAddon.FitAddon();
    term.loadAddon(term.fitAddon);

    if (!msg.encoding) {
      console.log('Unable to detect the default encoding of your server');
      msg.encoding = encoding;
    } else {
      console.log('The deault encoding of your server is ' + msg.encoding);
    }

    function term_write(text: any) {
      if (term) {
        term.write(text);
        if (!term.resized) {
          resize_terminal(term);
          term.resized = true;
        }
      }
    }

    wssh.geometry = function() {
      // for console use
      var geometry = current_geometry(term);
      console.log('Current window geometry: ' + JSON.stringify(geometry));
    };

    wssh.send = function(data: any) {
      // for console use
      if (!sock) {
        console.log('Websocket was already closed');
        return;
      }

      if (typeof data !== 'string') {
        console.log('Only string is allowed');
        return;
      }

      try {
        JSON.parse(data);
        sock.send(data);
      } catch (SyntaxError) {
        data = data.trim() + '\r';
        sock.send(JSON.stringify({'data': data}));
      }
    };

    wssh.reset_encoding = function() {
      // for console use
      if (encoding === msg.encoding) {
        console.log('Already reset to ' + msg.encoding);
      } else {
        // set_encoding(msg.encoding);
      }
    };

    wssh.resize = function(cols: any, rows: any) {
      // for console use
      if (term === undefined) {
        console.log('Terminal was already destroryed');
        return;
      }

      var valid_args = false;
      if (cols > 0 && rows > 0)  {
        var geometry = current_geometry(term);
        if (cols <= geometry.cols && rows <= geometry.rows) {
          valid_args = true;
        }
      }

      if (!valid_args) {
        console.log('Unable to resize terminal to geometry: ' + format_geometry(cols, rows));
      } else {
        term.on_resize(cols, rows);
      }
    };

    wssh.set_bgcolor = function(color: any) {
      set_backgound_color(term, color);
    };

    wssh.set_fontcolor = function(color: any) {
      set_font_color(term, color);
    };

    // wssh.custom_font = function() {
    //   update_font_family(term);
    // };

    wssh.default_font = function() {
      reset_font_family(term);
    };

    term.on_resize = function(cols: any, rows: any) {
      if (cols !== this.cols || rows !== this.rows) {
        console.log('Resizing terminal to geometry: ' + format_geometry(cols, rows));
        this.resize(cols, rows);
        sock.send(JSON.stringify({'resize': [cols, rows]}));
      }
    };

    term.onData(function(data: any) {
      sock.send(JSON.stringify({'data': data}));
    });

    sock.onopen = function() {
      term.open(terminal);
      toggle_fullscreen(term);
      // update_font_family(term);
      term.focus();
      state = CONNECTED;
      title_element.text = url_opts_data.title || default_title;
      if (url_opts_data.command) {
        setTimeout(function () {
          sock.send(JSON.stringify({'data': url_opts_data.command+'\r'}));
        }, 500);
      }
    };

    sock.onmessage = function(msg: any) {
      read_file_as_text(msg.data, term_write, decoder);
    };

    sock.onerror = function(e: any) {
      console.error(e);
    };

    sock.onclose = function(e: any) {
      term.dispose();
      term = undefined;
      sock = undefined;
      reset_wssh();
      // log_status(e.reason, true);
      state = DISCONNECTED;
      default_title = 'WebSSH';
      title_element.text = default_title;
    };

    $(window).resize(function(){
      if (term) {
        resize_terminal(term);
      }
    });
  }

  resetForm() {
    this.form.reset();
  }

  backToDashboard() {
    this.router.navigate(['dashboard']);
  }

}
