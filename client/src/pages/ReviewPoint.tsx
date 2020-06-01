import React, {Component} from 'react';
import {SubmittedPoint} from '../interfaces/submittedPointInterface';
import {
  getAllSubmittedPoints,
  deleteOneSubmittedPointByID,
} from '../dataservice/submittedPoints';
import {
  Button,
  Tabs,
  Space,
  Input,
  Typography,
  Popconfirm,
  Tag,
  Tooltip,
} from 'antd';
import Highlighter from 'react-highlight-words';
import {
  SearchOutlined,
  EditOutlined,
  ContainerOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import {Table} from 'antd';
import {withRouter, Link} from 'react-router-dom';
import {ColumnsType} from 'antd/lib/table';
import {UserSlider} from '../components/userInfo/UserSlider';

const {Paragraph} = Typography;

interface ColInterface {
  key: number;
  name: string;
  tcsnumber: string;
  submitted_by: string;
  status: string;
  date: Date;
  _id: string;
  description: string;
}

const {TabPane} = Tabs;

interface ReviewTableState {
  points: SubmittedPoint[];
  data: any;
  columns: any;
  searchText: string;
  searchedColumn: string;
  selectedRowKeys: any;
  isLoading: boolean;
}

interface ReviewTableProps {
  points: SubmittedPoint[];
  action?: string;
}

class reviewTable extends Component<ReviewTableProps, ReviewTableState> {
  searchInput: any;
  constructor(props) {
    super(props);
    this.state = {
      points: undefined,
      data: undefined,
      columns: undefined,
      searchText: '',
      searchedColumn: '',
      selectedRowKeys: [],
      isLoading: true,
    };

    this.processPoints = this.processPoints.bind(this);
  }

  componentDidMount() {
    if (this.props.points !== undefined) {
      this.processPoints(this.props.points);
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.points !== prevProps.points) {
      this.processPoints(this.props.points);
    }
  }

  selectRow = record => {
    // this.props.history.push("/points/"+record.tcsnumber)
    // const selectedRowKeys = [...this.state.selectedRowKeys];
    // if (selectedRowKeys.indexOf(record.key) >= 0) {
    //   selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
    // } else {
    //   selectedRowKeys.push(record.key);
    // }
    // this.setState({ selectedRowKeys });
  };
  onSelectedRowKeysChange = selectedRowKeys => {
    // console.log(this.props.points[selectedRowKeys[0]]);
    this.setState({selectedRowKeys});
  };

  // search
  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{padding: 8}}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{width: 188, marginBottom: 8, display: 'block'}}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{width: 90}}
          >
            Search
          </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{width: 90}}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => (
      <SearchOutlined style={{color: filtered ? '#1890ff' : undefined}} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({searchText: ''});
  };

  async processPoints(points: SubmittedPoint[]) {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        ...this.getColumnSearchProps('name'),
      },
      {
        title: 'ID',
        dataIndex: 'tcsnumber',
        ...this.getColumnSearchProps('tcsnumber'),
      },
      {
        title: 'Submitted By',
        dataIndex: 'submitted_by',
        render: (text, row, index) => {
          return <UserSlider userID={text}></UserSlider>;
        },
        // ...this.getColumnSearchProps('submitted_by'),
      },
      {
        title: 'Date',
        dataIndex: 'date',
        defaultSortOrder: 'ascend',
        //   width: '12%',
        sorter: {
          compare: (a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime(),
          // multiple: 3,
        },
      },
      {
        title: 'Status',
        dataIndex: 'status',
        render: status => {
          let color;
          switch (status) {
            case 'Rejected':
              color = 'volcano';
              break;
            case 'Approved':
              color = 'green';
              break;
            default:
              color = 'geekblue';
              break;
          }
          return <Tag color={color}>{status}</Tag>;
        },
        filters: [
          {text: 'Pending', value: 'Pending'},
          {text: 'Approved', value: 'Approved'},
          {text: 'Rejected', value: 'Rejected'},
        ],
        // defaultFilteredValue: ['Pending'],
        onFilter: (value, record) => {
          return record.status.indexOf(value.toString()) === 0;
        },
      },

      {
        title: 'Action',
        // key: "action",
        render: (text, record) => (
          <Space size="middle">
            {/* <Button> */}
            <Link
              to={{
                pathname: '/review/points/' + record._id,
                state: {
                  action: this.props.action,
                },
              }}
            >
              {this.props.action === 'Review' ? (
                <Tooltip title="Review">
                  <ContainerOutlined
                    style={{fontSize: '20px', color: 'green'}}
                  />
                </Tooltip>
              ) : (
                <Tooltip title="Edit">
                  <EditOutlined style={{fontSize: '20px'}} />
                </Tooltip>
              )}
            </Link>
            {/* </Button> */}
            {record.status !== 'Approved' && (
              <Popconfirm
                title={'Are you sure delete ' + record.name}
                onConfirm={() => {
                  deleteOneSubmittedPointByID(record._id).then(() => {
                    // let data = JSON.parse(JSON.stringify(this.state.data));
                    const dataSource = [...this.state.data];
                    this.setState({
                      data: dataSource.filter(item => item.key !== record.key),
                    });
                    // console.log(data)
                  });
                }}
                onCancel={() => {}}
                okText="Yes"
                cancelText="No"
              >
                <Tooltip title="Delete">
                  <DeleteOutlined style={{fontSize: '20px', color: 'red'}} />
                </Tooltip>
              </Popconfirm>
            )}
          </Space>
        ),
      },
    ] as ColumnsType<ColInterface>;

    if (this.props.action === 'Edit') {
      delete columns[2];
    }

    // columns.length=2;
    const data = [];
    for (let i = 0; i < points.length; i++) {
      // const user = await getOneUserByID(points[i].submitted_by);

      const message = points[i].message.split('\n').map((item, i) => {
        return <Paragraph key={i}>{item}</Paragraph>;
      });
      const point = {
        key: i,
        name: points[i].point.properties.name,
        tcsnumber: points[i].point.properties.tcsnumber,
        submitted_by: points[i].submitted_by,
        status: points[i].status,
        date: new Date(points[i].date).toLocaleDateString(),
        _id: points[i]._id,
        // gear: points[i].point.properties.gear,
        // length: points[i].point.properties.length,
        // pdep: points[i].point.properties.pdep,
        // depth: points[i].point.properties.depth,
        // map_status: points[i].point.properties.map_status,
        // co_name: points[i].point.properties.co_name,
        // ownership: points[i].point.properties.ownership,
        // Depth:  points[i].point.properties.depth,
        description: message,
      };
      data.push(point);
    }

    this.setState({data, columns});
    this.setState({isLoading: false});
  }

  render() {
    const {selectedRowKeys} = this.state;
    // const rowSelection = {
    //     selectedRowKeys,
    //     onChange: this.onSelectedRowKeysChange,
    // };
    return (
      <div>
        {!this.state.isLoading ? (
          <Table
            columns={this.state.columns}
            size="middle"
            scroll={{x: 10}}
            expandable={{
              expandedRowRender: record => (
                <p style={{margin: 0}}>{record.description}</p>
              ),
              rowExpandable: record => record.name !== 'Not Expandable',
            }}
            // rowSelection={rowSelection}
            onRow={record => ({
              onClick: () => {
                this.selectRow(record);
              },
            })}
            dataSource={this.state.data}
            loading={this.state.isLoading}
          />
        ) : null}
      </div>
    );
  }
}
const ReviewTable = withRouter(reviewTable);
export {reviewTable as ReviewTable};

interface State {
  submittedPoints: SubmittedPoint[];
  newPoints: SubmittedPoint[];
  existingPoints: SubmittedPoint[];
}

interface Props {}
class ReviewPoint extends Component<Props, State> {
  constructor(Props) {
    super(Props);
    this.state = {
      submittedPoints: undefined,
      newPoints: undefined,
      existingPoints: undefined,
    };
    this.renderNewCaves = this.renderNewCaves.bind(this);
    this.renderExistingCaves = this.renderExistingCaves.bind(this);
  }

  componentDidMount() {
    getAllSubmittedPoints().then(requstedSubmissions => {
      const newPoints = [];
      const existingPoints = [];
      requstedSubmissions.map(submission => {
        if (submission.pointType === 'New') {
          newPoints.push(submission);
        } else if (submission.pointType === 'Existing') {
          existingPoints.push(submission);
        }
      });

      this.setState({
        submittedPoints: requstedSubmissions,
        newPoints,
        existingPoints,
      });
    });
  }

  renderNewCaves() {
    return (
      // <Card>
      <ReviewTable action="Review" points={this.state.newPoints}></ReviewTable>
      // </Card>
    );
  }

  renderExistingCaves() {
    return (
      // <Card>
      <ReviewTable
        action="Review"
        points={this.state.existingPoints}
      ></ReviewTable>
      // </Card>
    );
  }

  render() {
    const newPointsLength =
      this.state.newPoints === undefined
        ? 0
        : this.state.newPoints.filter(value => value.status === 'Pending')
            .length;
    const existingPointLength =
      this.state.existingPoints === undefined
        ? 0
        : this.state.existingPoints.filter(value => value.status === 'Pending')
            .length;
    return (
      <div className="site-layout-content">
        <Tabs defaultActiveKey="1" type="line">
          <TabPane tab={'New Caves (' + newPointsLength + ')'} key="1">
            {this.renderNewCaves()}
          </TabPane>
          <TabPane tab={'Existing Caves (' + existingPointLength + ')'} key="2">
            {this.renderExistingCaves()}
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
export {ReviewPoint};
