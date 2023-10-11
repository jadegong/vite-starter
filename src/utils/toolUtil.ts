/* eslint-disable prefer-rest-params */
/**
 * Created by gqd on 2023/02/24.
 *
 * @format
 * Functions: extend, merge, commafy, formatCharts, dataUnit, iotDateFormat, export,
 * isFunction, isPlainObject, isObject, clone, isArray, isDom, isBuiltInObject, isPrimitive,
 * v0.0.1 2023/10/11 gqd export函数优化;
 */
import request from './request'

const toolUtil = {
  // jq extend
  extend(...restParams: Array<any>) {
    let options;
    let name;
    let src;
    let copy;
    let copyIsArray;
    let clone;
    let target = restParams[0] || {};
    let i = 1;
    const length = restParams.length;
    let deep = true; // 默认为深拷贝

    // Handle a deep copy situation
    if (typeof target === 'boolean') {
      deep = target;

      // Skip the boolean and the target
      target = restParams[i] || {};
      i++;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== 'object' && !this.isFunction(target)) {
      target = {};
    }

    // Extend jQuery itself if only one argument is passed
    if (i === length) {
      target = this;
      i--;
    }

    for (; i < length; i++) {
      // Only deal with non-null/undefined values
      // eslint-disable-next-line no-cond-assign
      if ((options = restParams[i]) != null) {
        // Extend the base object
        for (name in options) {
          copy = options[name];

          // Prevent Object.prototype pollution
          // Prevent never-ending loop
          if (name === '__proto__' || target === copy) {
            // eslint-disable-next-line no-continue
            continue;
          }

          // Recurse if we're merging plain objects or arrays
          // eslint-disable-next-line no-cond-assign
          if (deep && copy && (this.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
            src = target[name];

            // Ensure proper type for the source value
            if (copyIsArray && !Array.isArray(src)) {
              clone = [];
            } else if (!copyIsArray && !this.isPlainObject(src)) {
              clone = {};
            } else {
              clone = src;
            }
            copyIsArray = false;

            // Never move original objects, clone them
            target[name] = this.extend(deep, clone, copy);

            // Don't bring in undefined values
          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }

    // Return the modified object
    return target;
  },

  commafy(num: any, fix?: any) {
    if (num === undefined || num === '--' || num === '-') return '--';
    try {
      if (num != null) {
        if (fix || fix === 0) {
          num = `${parseFloat(num).toFixed(fix)}`;
        } else {
          num += '';
        }
        const re = /(-?\d+)(\d{3})/;
        while (re.test(num)) {
          num = num.replace(re, '$1,$2');
        }
      }
    } catch (e) {
      throw e;
      // console.log(e);
    } finally {
      // eslint-disable-next-line no-unsafe-finally
      return num;
    }
  },
  merge(target: any, source: any, overwrite: any) {
    const self = this;
    // We should escapse that source is string
    // and enter for ... in ...
    if (!self.isObject(source) || !self.isObject(target)) {
      return overwrite ? self.clone(source) : target;
    }

    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        const targetProp = target[key];
        const sourceProp = source[key];

        if (
          self.isObject(sourceProp) &&
          self.isObject(targetProp) &&
          !self.isArray(sourceProp) &&
          !self.isArray(targetProp) &&
          !self.isDom(sourceProp) &&
          !self.isDom(targetProp) &&
          !self.isBuiltInObject(sourceProp) &&
          !self.isBuiltInObject(targetProp) &&
          !self.isPrimitive(sourceProp) &&
          !self.isPrimitive(targetProp)
        ) {
          // 如果需要递归覆盖，就递归调用merge
          self.merge(targetProp, sourceProp, overwrite);
        } else if (overwrite || !(key in target)) {
          // 否则只处理overwrite为true，或者在目标对象中没有此属性的情况
          // NOTE，在 target[key] 不存在的时候也是直接覆盖
          target[key] = self.clone(source[key]);
        }
      }
    }

    return target;
  },
  formatCharts: function formatCharts(value: any, length: any) {
    // var w = $(document.body).outerWidth(true);
    const w = window.outerWidth;
    // const reg = /.*[\u4e00-\u9fa5]+.*$/; // 查询中文
    let res = '';
    let lines = 0;
    let objLength = 0;

    if (w < 1440) {
      length += 0;
    } else if (w >= 1440 && w < 1540) {
      length += 2;
    } else if (w >= 1540 && w < 1640) {
      length += 4;
    } else if (w >= 1640 && w < 1740) {
      length += 6;
    } else if (w >= 1740 && w < 1840) {
      length += 8;
    } else {
      length += 10;
    }

    for (let i = 0, l = value.length; i < l; i++) {
      // 如果是中文字符，则长度为2
      if (/.*[\u4e00-\u9fa5]+.*$/.test(value[i])) {
        objLength += 2;
        if (i < l - 1 && objLength % length === 0 && i !== 0) {
          res += value[i];
          res += '\n'; // 就是这里！！！
          lines++;
        } else if (i < l - 1 && Math.floor(objLength / length) > lines && i !== 0) {
          res = `${res}\n${value[i]}`; // 就是这里！！！
          lines++;
        } else {
          res += value[i];
        }
      } else {
        objLength += 1;
        res += value[i];
        if (i < l - 1 && objLength % length === 0 && i !== 0) {
          res += '\n'; // 就是这里！！！
          lines++;
        }
      }
    }
    return res;
  },
  /**
   * 数组转树形结构
   * @param list 源数组
   * @param tree 树
   * @param parentId 父ID
   */
  listToTree(list: Array<any>, tree: Array<any>, parentId: String, childrenVar = 'children') {
    list
      .sort((a, b) => a.orderNum - b.orderNum)
      .forEach((item) => {
        // 判断是否为父级菜单
        if (item.parentId === parentId) {
          const child = {
            ...item,
            key: item.menuCode,
            [childrenVar]: [],
          };
          // 迭代 list， 找到当前菜单相符合的所有子菜单
          toolUtil.listToTree(list, child[childrenVar], item.id, 'childList');
          // 删掉不存在 children 值的属性
          if (child[childrenVar].length <= 0) {
            delete child[childrenVar];
          }
          // 加入到树中
          tree.push(child);
        }
      });
  },
  /**
   * 树形转化为平铺数组
   * @param tree 树
   * @param list 平铺数组
   * @param childrenVar 子级数据变量
   */
  treeToList(tree: Array<any>, list: Array<any>, childrenVar = 'childList') {
    tree.forEach((item) => {
      const child = {
        ...item,
        key: item.id,
        [childrenVar]: undefined,
      };
      // 加入到树中
      list.push(child);
      // 判断是否为父级菜单
      if (item[childrenVar] && item[childrenVar].length > 0) {
        // 迭代 tree， 找到当前菜单的所有子菜单
        toolUtil.treeToList(item[childrenVar], list, childrenVar);
      }
    });
  },
  /*
    echarts数据单位“万”“亿”
    type    判断转换数据格式   flowUnity  流量（单位统一），flowDisunity  流量（单位不统一） countBillionUnity  亿万格式（单位统一），countBillionDisunity  亿万格式（单位不统一）
    unit    最小单位：如“条”、“个”
    val     需要加单位的数据
    max     判断出最大的值，流量时不用传
    digit   保留小数的位数 (默认为2位)     //author  heyong
    retainedDecimal   数据过万过亿(正好整数)是否保留小数true/false     //author  renjinhong
    */
  dataUnit(type: any, unit: any, value: any, max: any, digit: any, retainedDecimal: any) {
    if (value === undefined || value === '--' || value === '-') return '--';
    let val = null;

    switch (type) {
      case 'FLOW_UNITY': // flow代表流量且单位统一，如KB,MB,GB,TB
        val = Math.abs(value);

        if (max < 1024) {
          // 字节单位为“KB”
          val = this.commafy(val, 2);
          val += `K${unit}`;
        } else if (max < 1024 * 1024 && max >= 1024) {
          // 字节单位为“MB”
          val = this.commafy(val / 1024, 2);
          val += `M${unit}`;
        } else if (max < 1024 * 1024 * 1024 && max >= 1024 * 1024) {
          // 字节单位为“GB”
          val = this.commafy(val / (1024 * 1024), 2);
          val += `G${unit}`;
        } else if (max < 1024 * 1024 * 1024 * 1024 && max >= 1024 * 1024 * 1024) {
          // 字节单位为“TB”
          val = this.commafy(val / (1024 * 1024 * 1024), 2);
          val += `T${unit}`;
        } // 字节单位为“PB”
        else {
          val = this.commafy(val / (1024 * 1024 * 1024 * 1024), 2);
          val += `P${unit}`;
        }

        if (value < 0) {
          return `-${val}`;
        }
        return val;

      case 'FLOW_DISUNITY': // flow代表流量且单位不统一，如KB,MB,GB,TB
        val = Math.abs(value);

        if (val < 1024) {
          // 字节单位为“KB”
          if (val % 1 > 0) {
            val = this.commafy(val, digit || 2);
          } else {
            // 整数，根据retainedDecimal（多用于label显示）的值（true/false）处理数据
            if (retainedDecimal) {
              val = this.commafy(val, 2);
            }
            val = this.commafy(val);
          }
          // val = this.commafy(val, digit || 2);
          val += `K${unit}`;
        } else if (val < 1024 * 1024 && val >= 1024) {
          // 字节单位为“MB”
          if (val % 1024 > 0) {
            val = this.commafy(val / 1024, digit || 2);
          } else {
            // 整数，根据retainedDecimal（多用于label显示）的值（true/false）处理数据
            if (retainedDecimal) {
              val = this.commafy(val / 1024, 2);
            }
            val = this.commafy(val / 1024);

            // val = this.commafy(val / 1024);
          }
          val += `M${unit}`;
        } else if (val < 1024 * 1024 * 1024 && val >= 1024 * 1024) {
          // 字节单位为“GB”
          if (val % (1024 * 1024) > 0) {
            val = this.commafy(val / (1024 * 1024), digit || 2);
          } else {
            // 整数，根据retainedDecimal（多用于label显示）的值（true/false）处理数据
            if (retainedDecimal) {
              val = this.commafy(val / (1024 * 1024), 2);
            }
            val = this.commafy(val / (1024 * 1024));

            // val = this.commafy(val / (1024 * 1024));
          }
          val += `G${unit}`;
        } else if (val < 1024 * 1024 * 1024 * 1024 && val >= 1024 * 1024 * 1024) {
          // 字节单位为“TB”
          if (val % (1024 * 1024 * 1024) > 0) {
            val = this.commafy(val / (1024 * 1024 * 1024), digit || 2);
          } else {
            // 整数，根据retainedDecimal（多用于label显示）的值（true/false）处理数据
            if (retainedDecimal) {
              val = this.commafy(val / (1024 * 1024 * 1024), 2);
            }
            val = this.commafy(val / (1024 * 1024 * 1024));

            // val = this.commafy(val / (1024 * 1024 * 1024));
          }
          val += `T${unit}`;
        } // 字节单位为“PB”
        else {
          if (val % (1024 * 1024 * 1024 * 1024) > 0) {
            val = this.commafy(val / (1024 * 1024 * 1024 * 1024), digit || 2);
          } else {
            // 整数，根据retainedDecimal（多用于label显示）的值（true/false）处理数据
            if (retainedDecimal) {
              val = this.commafy(val / (1024 * 1024 * 1024 * 1024), 2);
            }
            val = this.commafy(val / (1024 * 1024 * 1024 * 1024));

            // val = this.commafy(val / (1024 * 1024 * 1024 * 1024));
          }
          val += `P${unit}`;
        }

        if (value < 0) {
          return `-${val}`;
        }
        return val;

      case 'COUNT_BILLION_UNITY': // countBillion代表亿万格式且单位统一，如“万条”、“亿条”
        val = Math.abs(value);

        // 定义最小单位
        if (max < 10000) {
          val = this.commafy(val, 2);
          val += unit;
        }
        // 定义“万”级单位
        else if (max < 100000000 && max >= 10000) {
          if (val % 10000 > 0) {
            if (digit === 0 || digit) {
              val = this.commafy(val / 10000, digit);
            } else {
              val = this.commafy(val / 10000, 2);
            }
          } else {
            val = this.commafy(val / 10000);
          }
          val += `万${unit}`;
        }
        // 定义“亿”级单位
        else {
          if (val % 100000000 > 0) {
            if (digit === 0 || digit) {
              val = this.commafy(val / 100000000, digit);
            } else {
              val = this.commafy(val / 100000000, 2);
            }
          } else {
            val = this.commafy(val / 100000000);
          }
          val += `亿${unit}`;
        }

        if (value < 0) {
          return `-${val}`;
        }
        return val;

      case 'COUNT_BILLION_DISUNITY': // countBillion代表亿万格式且单位不统一，如“万条”、“亿条”
        val = Math.abs(value);

        // 定义最小单位
        if (val < 10000) {
          /* if(val % 1 > 0){
                                  //非整数，根据digit处理数据
                                  val = this.commafy(val, 0 || digit);
                              }else{
                                  //整数，根据retainedDecimal（多用于label显示）的值（true/false）处理数据
                                  if(retainedDecimal){
                                      val = this.commafy(val,2);
                                  }else{
                                      val = this.commafy(val);
                                  }
                              } */
          val = this.commafy(val, 0 || digit);
          val += unit;
        }
        // 定义“万”级单位
        else if (val < 100000000 && val >= 10000) {
          if (val % 10000 > 0) {
            if (digit === 0 || digit) {
              val = this.commafy(val / 10000, digit);
            } else {
              val = this.commafy(val / 10000, 2);
            }
          } else {
            // 整数，根据retainedDecimal（多用于label显示）的值（true/false）处理数据
            if (retainedDecimal) {
              val = this.commafy(val / 10000, 2);
            }
            val = this.commafy(val / 10000);
          }
          val += `万${unit}`;
        }
        // 定义“亿”级单位
        else {
          if (val % 100000000 > 0) {
            if (digit === 0 || digit) {
              val = this.commafy(val / 100000000, digit);
            } else {
              val = this.commafy(val / 100000000, 2);
            }
          } else if (retainedDecimal) {
            val = this.commafy(val / 100000000, 2);
          } else {
            val = this.commafy(val / 100000000);
          }
          val += `亿${unit}`;
        }

        if (value < 0) {
          return `-${val}`;
        }
        return val;

      default:
        return value;
    }
  },
  /*
     对yyyymmddhhmmss格式日期的格式化处理
     v ：值 （String or Array）
     tp ：类型 （year|month|week|day|hour|minute|second）
     op ：格式化字符设置（根据自己的需求设置替换方法内部的默认设置）
     @author hy
     */
  iotDateFormat(v: any, tp: any, op: any) {
    if (!v) {
      return false;
    }
    v = v.replace(/-/g, '');

    let t = 'month';
    if (tp) {
      t = tp;
    }

    let dop = {
      ysp: '年',
      msp: '月',
      dsp: '日',
      dtsp: ' ',
      centersp: ' - ',
      housp: '时',
      minsp: '分',
      secsp: '秒',
    };

    if (op) {
      dop = this.extend({}, dop, op);
    }

    switch (t) {
      case 'year':
        if (typeof v === 'string') {
          return v + dop.ysp;
        }
        return v[0] + dop.ysp + dop.centersp + v[1] + dop.ysp;

      case 'month':
        if (typeof v === 'string') {
          return v.substr(0, 4) + dop.ysp + v.substr(4, 2) + dop.msp;
        }
        return v[0].substr(0, 4) + dop.ysp + v[0].substr(4, 2) + dop.msp + dop.centersp + v[1].substr(0, 4) + dop.ysp + v[1].substr(4, 2) + dop.msp;

      case 'week':
        if (typeof v === 'string') {
          return v.substr(0, 4) + dop.ysp + v.substr(4, 2) + dop.msp + v.substr(6, 2) + dop.dsp;
        }
        return v[0].substr(0, 4) + dop.ysp + v[0].substr(4, 2) + dop.msp + v[0].substr(6, 2) + dop.dsp + dop.centersp + v[1].substr(0, 4) + dop.ysp + v[1].substr(4, 2) + dop.msp + v[1].substr(6, 2) + dop.dsp;

      case 'day':
        if (typeof v === 'string') {
          return v.substr(0, 4) + dop.ysp + v.substr(4, 2) + dop.msp + v.substr(6, 2) + dop.dsp;
        }
        return v[0].substr(0, 4) + dop.ysp + v[0].substr(4, 2) + dop.msp + v[0].substr(6, 2) + dop.dsp + dop.centersp + v[1].substr(0, 4) + dop.ysp + v[1].substr(4, 2) + dop.msp + v[1].substr(6, 2) + dop.dsp;

      case 'hour':
        if (typeof v === 'string') {
          return v.substr(0, 4) + dop.ysp + v.substr(4, 2) + dop.msp + v.substr(6, 2) + dop.dsp + dop.dtsp + v.substr(8, 2) + dop.housp;
        }
        return v[0].substr(0, 4) + dop.ysp + v[0].substr(4, 2) + dop.msp + v[0].substr(6, 2) + dop.dsp + dop.dtsp + v[0].substr(8, 2) + dop.housp + dop.centersp + v[1].substr(0, 4) + dop.ysp + v[1].substr(4, 2) + dop.msp + v[1].substr(6, 2) + dop.dsp + dop.dtsp + v[1].substr(8, 2) + dop.housp;

      case 'minute':
        if (typeof v === 'string') {
          return v.substr(0, 4) + dop.ysp + v.substr(4, 2) + dop.msp + v.substr(6, 2) + dop.dsp + dop.dtsp + v.substr(8, 2) + dop.housp + v.substr(10, 2) + dop.minsp;
        }
        return (
          v[0].substr(0, 4) +
          dop.ysp +
          v[0].substr(4, 2) +
          dop.msp +
          v[0].substr(6, 2) +
          dop.dsp +
          dop.dtsp +
          v[0].substr(8, 2) +
          dop.housp +
          v[0].substr(10, 2) +
          dop.minsp +
          dop.centersp +
          v[1].substr(0, 4) +
          dop.ysp +
          v[1].substr(4, 2) +
          dop.msp +
          v[1].substr(6, 2) +
          dop.dsp +
          dop.dtsp +
          v[1].substr(8, 2) +
          dop.housp +
          v[1].substr(10, 2) +
          dop.minsp
        );

      case 'second':
        if (typeof v === 'string') {
          return v.substr(0, 4) + dop.ysp + v.substr(4, 2) + dop.msp + v.substr(6, 2) + dop.dsp + dop.dtsp + v.substr(8, 2) + dop.housp + v.substr(10, 2) + dop.minsp + v.substr(12, 2) + dop.secsp;
        }
        return (
          v[0].substr(0, 4) +
          dop.ysp +
          v[0].substr(4, 2) +
          dop.msp +
          v[0].substr(6, 2) +
          dop.dsp +
          dop.dtsp +
          v[0].substr(8, 2) +
          dop.housp +
          v[0].substr(10, 2) +
          dop.minsp +
          v[0].substr(12, 2) +
          dop.secsp +
          dop.centersp +
          v[1].substr(0, 4) +
          dop.ysp +
          v[1].substr(4, 2) +
          dop.msp +
          v[1].substr(6, 2) +
          dop.dsp +
          dop.dtsp +
          v[1].substr(8, 2) +
          dop.housp +
          v[1].substr(10, 2) +
          dop.minsp +
          v[1].substr(12, 2) +
          dop.secsp
        );

      default:
        return v;
    }
  },
  // IE判断
  IEVersion() {
    const { userAgent } = navigator; // 取得浏览器的userAgent字符串
    const isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1; // 判断是否IE<11浏览器
    const isEdge = userAgent.indexOf('Edge') > -1 && !isIE; // 判断是否IE的Edge浏览器
    const isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
    if (isIE) {
      const reIE = new RegExp('MSIE (\\d+\\.\\d+);');
      reIE.test(userAgent);
      const fIEVersion = parseFloat(RegExp.$1);
      if (fIEVersion === 7) {
        return 7;
      }
      if (fIEVersion === 8) {
        return 8;
      }
      if (fIEVersion === 9) {
        return 9;
      }
      if (fIEVersion === 10) {
        return 10;
      }
      return 6; // IE版本<=7
    }
    if (isEdge) {
      return 'edge'; // edge
    }
    if (isIE11) {
      return 11; // IE11
    }
    return false; // 不是ie浏览器
  },
  /**
   * 导出
   * v1.0.0 2022/04/11 gqd 增加请求方法参数;
   * v1.0.0 2023/06/02 gqd 去除responseType参数，防止返回数据格式被改变;
   * v1.0.0 2023/06/10 gqd 增加responseType参数，否则会导致返回文件不能打开;
   */
  export(url: any, params: any, method = 'get', callback: any) {
    const obj = {
      url,
      responseType: 'blob',
      method: method,
    };
    // if (blob) {
    //   obj.responseType = 'blob'
    // }
    if (method === 'get') {
      obj.params = params;
    }
    if (method === 'post') {
      obj.data = params;
    }
    request(obj).then((res: any) => {
      if (callback) callback();
      if (res.type === 'application/json') {
        return;
      }
      let { fileName, blob } = res;
      if (this.IEVersion()) {
        window.navigator.msSaveOrOpenBlob(blob);
      } else {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = url;
        a.download = decodeURIComponent(fileName).replace(new RegExp('"', 'g'), '');
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    });
  },

  // export(url: any, param: any) {
  //   const domform = document.createElement('form');
  //   domform.id = 'exportForm';
  //   domform.name = 'exportForm';
  //   domform.style.display = 'none';
  //   document.body.appendChild(domform);
  //   const input = document.createElement('input');
  //   input.name = 'obj';
  //   input.value = JSON.stringify(param);
  //   domform.appendChild(input);
  //   domform.method = 'POST';
  //   domform.action = url; // 导出接口地址
  //   domform.submit();
  //   document.body.removeChild(domform);
  // },

  isFunction(obj: any) {
    // Support: Chrome <=57, Firefox <=52
    // In some browsers, typeof returns "function" for HTML <object> elements
    // (i.e., `typeof document.createElement( "object" ) === "function"`).
    // We don't want to classify *any* DOM node as a function.
    return typeof obj === 'function' && typeof obj.nodeType !== 'number';
  },

  isArray(value: any) {
    return Object.prototype.toString.call(value) === '[object Array]';
  },
  isDom(value: any) {
    return typeof value === 'object' && typeof value.nodeType === 'number' && typeof value.ownerDocument === 'object';
  },
  isBuiltInObject(value: any) {
    // 用于处理merge时无法遍历Date等对象的问题
    const BUILTIN_OBJECT: any = {
      '[object Function]': 1,
      '[object RegExp]': 1,
      '[object Date]': 1,
      '[object Error]': 1,
      '[object CanvasGradient]': 1,
      '[object CanvasPattern]': 1,
      // For node-canvas
      '[object Image]': 1,
      '[object Canvas]': 1,
    };
    return !!BUILTIN_OBJECT[Object.prototype.toString.call(value)];
  },
  isPrimitive(obj: any) {
    const primitiveKey = '__ec_primitive__';
    return obj[primitiveKey];
  },

  isObject(value: any) {
    // Avoid a V8 JIT bug in Chrome 19-20.
    // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
    const type = typeof value;
    return type === 'function' || (!!value && type === 'object');
  },

  isPlainObject(obj: any) {
    const class2type = {};
    const toString = class2type.toString;
    const hasOwn = class2type.hasOwnProperty;
    const fnToString = hasOwn.toString;
    const ObjectFunctionString = fnToString.call(Object);

    // Detect obvious negatives
    // Use toString instead of jQuery.type to catch host objects
    if (!obj || toString.call(obj) !== '[object Object]') {
      return false;
    }
    const proto = Object.getPrototypeOf(obj);

    // Objects with no prototype (e.g., `Object.create( null )`) are plain
    if (!proto) {
      return true;
    }

    // Objects with prototype are plain iff they were constructed by a global Object function
    const Ctor = hasOwn.call(proto, 'constructor') && proto.constructor;
    return typeof Ctor === 'function' && fnToString.call(Ctor) === ObjectFunctionString;
  },

  clone(source: any) {
    const self = this;
    if (source == null || typeof source !== 'object') {
      return source;
    }

    const TYPED_ARRAY: any = {
      '[object Int8Array]': 1,
      '[object Uint8Array]': 1,
      '[object Uint8ClampedArray]': 1,
      '[object Int16Array]': 1,
      '[object Uint16Array]': 1,
      '[object Int32Array]': 1,
      '[object Uint32Array]': 1,
      '[object Float32Array]': 1,
      '[object Float64Array]': 1,
    };
    // 用于处理merge时无法遍历Date等对象的问题
    const BUILTIN_OBJECT: any = {
      '[object Function]': 1,
      '[object RegExp]': 1,
      '[object Date]': 1,
      '[object Error]': 1,
      '[object CanvasGradient]': 1,
      '[object CanvasPattern]': 1,
      // For node-canvas
      '[object Image]': 1,
      '[object Canvas]': 1,
    };
    let result = source;
    const typeStr = Object.prototype.toString.call(source);

    if (typeStr === '[object Array]') {
      result = [];
      for (let i = 0, len = source.length; i < len; i++) {
        result[i] = self.clone(source[i]);
      }
    } else if (TYPED_ARRAY[typeStr]) {
      result = source.constructor.from(source);
    } else if (!BUILTIN_OBJECT[typeStr] && !self.isPrimitive(source) && !self.isDom(source)) {
      result = {};
      for (const key in source) {
        if (source.hasOwnProperty(key)) {
          result[key] = self.clone(source[key]);
        }
      }
    }

    return result;
  },

  /**
   * 处理router.config.js里的路由配置，返回VueRouter的路由配置结构。
   */
  // dealWithRoutesConfig(arr = []) {
  // let retArr = [];
  // arr.map((v, i) => {
  // let tempObj = {
  // path: {},
  // };
  // });
  // },
};

export default toolUtil;
