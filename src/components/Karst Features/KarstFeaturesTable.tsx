import React, {useContext, useState, useEffect, useRef} from 'react';
import {Table, Input, Popconfirm, Form} from 'antd';
import {DeleteOutlined} from '@ant-design/icons';

const {TextArea} = Input;
const EditableContext = React.createContext({} as any);

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({index, ...props}) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: string;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef();
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({[dataIndex]: record[dataIndex]});
  };

  const save = async e => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({...record, ...values});
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{margin: 0}}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <TextArea
          ref={inputRef}
          rows={5}
          onBlur={save}
          style={{width: '300px'}}
        />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{paddingRight: 24}}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

interface State {
  columns: any;
  dataSource: any;
}

interface Props {
  onChange: (data: any) => void;
  columns: any;
  dataSource: any;
}

class KarstFeaturesTable extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: this.props.dataSource,
      columns: [
        {
          title: 'operation',
          dataIndex: 'operation',
          render: (text, record) =>
            this.state.dataSource.length >= 1 ? (
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => this.handleDelete(record.key)}
              >
                <DeleteOutlined></DeleteOutlined>
              </Popconfirm>
            ) : null,
        },
        ...this.props.columns,
      ],
    };
  }

  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.setState(
      {dataSource: dataSource.filter(item => item.key !== key)},
      () => {
        this.props.onChange(this.state.dataSource);
      }
    );
  };

  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({dataSource: newData}, () => {
      this.props.onChange(this.state.dataSource);
    });
  };

  render() {
    const {dataSource} = this.state;
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
    const columns = this.state.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
        <Table
          size="small"
          components={components}
          // rowClassName={() => 'editable-row'}
          // scroll={{ x: '300px' }}
          dataSource={dataSource}
          style={{overflowX: 'scroll'}}
          columns={columns}
        />
      </div>
    );
  }
}

export {KarstFeaturesTable};
