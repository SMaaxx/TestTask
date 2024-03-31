import React from "react";
import styled from  'styled-components';

interface Param {
  id: number;
  name: string;
  type: string;
}

interface ParamValue {
  paramId: number;
  value: string;
}

interface Model {
  paramValues: ParamValue[];
}

interface Props {
  params: Param[];
  model: Model;
}

interface DataItem {
  name: string
  value: string
}

interface Data {
  [key: number]: DataItem
}

interface State {
  data: Data
  currentPage: string
  model: Model
}

interface ButtonProps {
  isactive: string
}

const Container = styled.div`
  background: linear-gradient(24deg, #EB82C8FF 15%, #F7DD75FF 100%);
  width: 100%;
  height: 100vh;
`;

const ButtonBar = styled.div `
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding: 0 10px 10px 10px;
`
const Panel = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 500px;
  width: 500px;

  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  background-color: #ffffff;
  opacity: 0.7;
  border-radius: 5px;
  padding: 20px;
`

const Item = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 10px;
`;

const Content= styled.div`
    overflow: auto;
    &::-webkit-scrollbar {
      width: 4px;
      background-color: #f9f9fd;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 2px;
      background-color: #FFE997FF;
    }
    height: 90%;
`;

const Name = styled.div`
  text-align: center;
`;

const Value = styled.input`
  width: 80%;
  padding: 5px;
`;


const Button = styled.div<ButtonProps>`
  display: flex;
  padding: 10px 20px;
  align-items: center;
  text-align: center;
  cursor: pointer;
  border-radius: 5px; 
  border: 1px solid rgb(237 178 188);
  background: ${props => (props.isactive === 'true' ? '#FFE997FF' : '#ffffff')}
`

class ParamEditor extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      currentPage: '',
      data: {},
      model: {
        paramValues: []
      }
    }
  }

  componentDidMount() {
    const { params , model } = this.props;
    this.setState({
      data: this.getData(params, model),
      currentPage: 'params',
      model: model
    });
  }

  getData(params: Param[], model: Model): Data {
    const data: Data = params.reduce((accumulator: Data, item: Param) => {

      return {
        ...accumulator,
          [item.id]: {
              name: item.name,
              value: ''
          }
        }
    }, {})

    model.paramValues.forEach((item: ParamValue) => data[item.paramId].value = item.value);

    return data;
  }

  handleChangeValue(key: number, value: DataItem): void {
    const { data} = this.state;

    this.setState({ data: {...data, [key]: value}})
  }

  public getModel() {
    const { data } = this.state;

    const model: Model = {
      paramValues: Object.entries(data).reduce((accumulator: ParamValue[], [key, value]: [string, DataItem]) => {
            accumulator.push({
              paramId: Number(key),
              value: value.value
            })

            return accumulator
          }, []
      )
    }

    return model
  }

  render() {
    const { data, currentPage } = this.state;

    return (
      <Container>
        <Panel>
          <ButtonBar>
            <Button
                onClick={() => this.setState({currentPage: 'params'})}
                isactive={currentPage === 'params' ? 'true' : 'false'}
            >
              Параметры
            </Button>
            <Button
                onClick={() => this.setState({currentPage: 'structure'})}
                isactive={currentPage === 'structure' ? 'true' : 'false'}
            >
              Полная структура
            </Button>
          </ButtonBar>
          <Content>
            {(currentPage === 'params' && data) && Object.entries(data).map(([key, value]: [string, DataItem]) => {
              return (
                <Item key={key}>
                  <Name>{value.name}</Name>
                  <Value
                    onChange={(e) => this.handleChangeValue(Number(key), {...value, value: e.target.value})}
                    defaultValue={value.value}
                  />
                </Item>
              );
            })}
            {currentPage === 'structure' && (
              <pre>
                {JSON.stringify(this.getModel(), null, 2)}
              </pre>
            )}
          </Content>
        </Panel>
      </Container>
    );
  }
}

export default ParamEditor;