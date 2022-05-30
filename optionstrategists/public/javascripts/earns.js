//Test data response:
//
function sendToServer(paramsInput) {
    let header = {headers: {'Content-Type': 'application/json'}};
    axios.post('/earns', paramsInput, header).then((response) => {
        if(!response.data){
            throw 'invalid response';
        }
        show_earn_charts(response.data.title, response.data.datas, 'idEarnChartsContent', response.data.curPrice)
    }).catch((error) => {
        console.log(error);
    }).finally(() => {
        enableCalculateButton();
    });
}

function show_earn_charts(title, datas, chart_id, cur_price) {
    console.log(datas, chart_id);

    let init_param = MakeEarnChartInitParameters(title,
        datas['price'],
        datas['ivlow'],
        datas['ivhigh'],
        datas['mature'],
        cur_price);

    try {
        let lineChart = echarts.init(document.getElementById(chart_id), 'light');
        lineChart.setOption(init_param);
        return lineChart;
    } catch (err) {
        console.log(`Error draw Earn charts: ${err}`);
    }
}


function MakeEarnChartInitParameters(title, pricesArr, lowArr, highArr, matureArr, cur_price) {
    let init_parameters = {
        title: {
            text: title, // 标题名称
        },
        tooltip: {
            show: true, // 是否显示
            trigger: 'axis', // 触发类型  'item'图形触发：散点图，饼图等无类目轴的图表中使用； 'axis'坐标轴触发；'none'：什么都不触发。
            axisPointer: { // 坐标轴指示器配置项。
                type: 'cross', // 'line' 直线指示器  'shadow' 阴影指示器  'none' 无指示器  'cross' 十字准星指示器。
                axis: 'auto', // 指示器的坐标轴。
                snap: true, // 坐标轴指示器是否自动吸附到点上
                label: {
                    backgroundColor: '#6a7985'
                }
            },
            backgroundColor: 'rgba(50,50,50,0.7)', // 提示框浮层的背景颜色。
            borderColor: '#333', // 提示框浮层的边框颜色。
            borderWidth: 0, // 提示框浮层的边框宽。
            padding: 5, // 提示框浮层内边距，
            textStyle: { // 提示框浮层的文本样式。
                color: '#fff',
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontFamily: 'sans-serif',
                fontSize: 14,
            },
            extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);', // 额外附加到浮层的 css 样式
            confine: false, // 是否将 tooltip 框限制在图表的区域内。
            formatter: function (params) {
                let str = "Price: " + `${params[0].axisValue}` + "<br/>";
                params.forEach((item, idx) => {
                    str += `${item.marker}${item.seriesName}: ${item.data}`
                    switch (idx) {
                        case 0:
                            str += '';
                            break;
                        case 1:
                            str += '';
                            break;
                        case 2:
                            str += '';
                            break;
                        default:
                            str += '';
                    }
                    str += idx === params.length - 1 ? '' : '<br/>'
                })
                return str
            }
        },

        dataZoom: [ //用于区域缩放
            {
                bottom: 0,//下滑块距离x轴底部的距离
                height: 50,//下滑块手柄的高度调节
                type: 'slider',//类型,滑动块插件
                show: true,//是否显示下滑块
                xAxisIndex: [0],//选择的x轴
            }
        ],
        xAxis: {
            type: 'category',
            data: pricesArr
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: 'High IV',
                data: highArr,
                type: 'line',
                symbol: 'none',
                smooth: true,
                color: 'lightcoral',
            },
            {
                name: 'Low IV',
                data: lowArr,
                type: 'line',
                symbol: 'none',
                smooth: true,
                color: 'lightseagreen',
            },
            {
                name: 'Mature',
                data: matureArr,
                type: 'line',
                symbol: 'none',
                smooth: true,
                color: 'lightslategray',
                markLine: {
                    data: [{
                        name: 'X 轴值为 100 的竖直线',
                        xAxis: "" + cur_price
                    }],
                    symbol: 'none',
                }
            },
        ]
    };

    return init_parameters;
};
