
/**标记点**/
 const markers1 = [{
        id: 'guide-1',
        position: {
            yaw: '-50deg',
            pitch: '-6deg'
        },
        image: require('./../assets/arrow.gif'),
        size: {
            width: 50,
            height: 50
        },
        tooltip: {
            content: "往前走",
            className: 'custom-tooltip',
            position: 'top',
            trigger: 'chan',
        },
    },
    {
        id: 'guide-2',
        position: {
            yaw: '2.024835775299782',
            pitch: '-0.6601597350598372'
        },
        image: require('./../assets/arrow.gif'),
        size: {
            width: 50,
            height: 50
        },
    },
    {
        id: 'video-4',
        position: {
            yaw: '6.023883039115196',
            pitch: '0.10174752585886959'
        },
        image: require('./../assets/camera.png'),
        size: {
            width: 50,
            height: 50
        },
        anchor: 'Holly',
    },
    
];
const markers2 = [{
    id: 'guide-1',
    position: {
        yaw: '-27deg',
        pitch: '-6deg'
    },
    image: require('./../assets/arrow.gif'),
    size: {
        width: 50,
        height: 50
    },
    tooltip: {
        content: "往前走",
        className: 'custom-tooltip',
        position: 'top',
        trigger: 'chan',
    },
},{
    id: 'guide-0',
    position: {
        yaw: '-20deg',
        pitch: '-6deg'
    },
    image: require('./../assets/arrow.gif'),
    size: {
        width: 50,
        height: 50
    },
    tooltip: {
        content: "往前走",
        className: 'custom-tooltip',
        position: 'top',
        trigger: 'chan',
    },
},]
/**全景图片列表**/
export const photos1 = [{
        id: 'sphere',
        panorama: require('./../assets/guide/2.jpg'),
        thumbnail: require('./../assets/guide/2_thumbnail.jpg'),
        name:"图一",
        options: {
            caption: '图一',
        },
        markers: markers1,
        

    },
    {
        id: 'sphere-test',
        panorama: require('./../assets/guide/3.jpg'),
        thumbnail:require('./../assets/guide/3_thumbnail.jpg'),
        name: '图二',
        options: {
            caption: '图二',
        },
        markers: [{
            id: 'guide-2',
            size: {
                width: 50,
                height: 50
            },
            position: {
                yaw: '-110deg',
                pitch: '0deg'
            },
            image: require('./../assets/arrow.gif'),
        }, ]
    },
    {
        id: 'key-biscayne',
        panorama: require('./../assets/guide/4.jpg'),
        thumbnail: require('./../assets/guide/4_thumbnail.jpg'),
        name: '图三',
        options: {
            caption: '图三',
        },
        markers: []
    },
]

export const photos2=[
    {
        id: 'sphere1',
        panorama: require('./../assets/floor/037.jpg'),
        thumbnail: require('./../assets/floor/037_thumbnail.jpg'),
        options: {
            caption: '图2.1',
        },
        markers: [
            {
                id: 'guide-1',
                position: {
                    yaw: '-170deg',
                    pitch: '4deg'
                },
                image: require('./../assets/arrow.gif'),
                size: {
                    width: 50,
                    height: 50
                },
                tooltip: {
                    content: "往展厅2",
                    className: 'custom-tooltip',
                    position: 'top',
                    trigger: 'chan',
                },
            }
        ],
    },
    {
        id: 'sphere2',
        panorama: require('./../assets/floor/038.jpg'),
        thumbnail: require('./../assets/floor/038_thumbnail.jpg'),
        options: {
            caption: '图2.1',
        },
        markers: [{
            id: 'guide-0',
            position: {
                yaw: '35deg',
                pitch: '-5deg'
            },
            image: require('./../assets/arrow.gif'),
            size: {
                width: 50,
                height: 50
            },
            tooltip: {
                content: "回展厅1",
                className: 'custom-tooltip',
                position: 'top',
                trigger: 'click',
            },
        }],
    },
    {
        id: 'sphere3',
        panorama: require('./../assets/floor/039.jpg'),
        thumbnail: require('./../assets/floor/039_thumbnail.jpg'),
        options: {
            caption: '图2.1',
        },
        markers: [{
            id: 'guide-3',
            position: {
                yaw: '125deg',
                pitch: '-5deg'
            },
            image: require('./../assets/arrow.gif'),
            size: {
                width: 50,
                height: 50
            },
            tooltip: {
                content: "去展厅4",
                className: 'custom-tooltip',
                position: 'top',
                trigger: 'click',
            },
        }],
    },
    {
        id: 'sphere4',
        panorama: require('./../assets/floor/040.jpg'),
        thumbnail: require('./../assets/floor/040_thumbnail.jpg'),
        options: {
            caption: '图2.1',
        },
        markers: [{
            id: 'guide-2',
            position: {
                yaw: '35deg',
                pitch: '-5deg'
            },
            image: require('./../assets/arrow.gif'),
            size: {
                width: 50,
                height: 50
            },
            tooltip: {
                content: "去展厅3",
                className: 'custom-tooltip',
                position: 'top',
                trigger: 'click',
            },
        },{
            id: 'mark-3',
            position: {
                yaw: '85deg',
                pitch: '-5deg'
            },
            image: require('./../assets/exit.png'),
            size: {
                width: 50,
                height: 50
            },
            tooltip: {
                content: "安全出口",
                className: 'custom-tooltip',
                position: 'top',
                trigger: 'click',
            },
        }],
    }
]