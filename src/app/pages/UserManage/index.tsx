/**
 *
 * UserManage
 *
 */
import React, { memo, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import {
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from 'reactstrap';
import { LocationIcon, BackIcon } from 'app/components/Icons';
import heart from 'images/icon/heart.png';
import crown from 'images/icon/crown.png';
import person from 'images/icon/person.png';
import luffing from 'images/icon/luffing.png';
import { FesButton } from 'app/components/FesButton/Loadable';
import { Radar } from 'react-chartjs-2';
import { RadarData, RadarOptions } from 'app/config/chart';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserDetail } from 'app/pages/Users/slice/selectors';
import { useUserSlice } from 'app/pages/Users/slice';
import { useModalSlice } from 'app/pages/Modal/slice';
import { useParams, useHistory } from 'react-router-dom';
import _ from 'lodash';

interface Props {}

interface ParamTypes {
  id: string;
}

export const UserManage = memo((props: Props) => {
  const chartRef = React.useRef<Radar>(null);
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('1');
  const [avatars, setAvatars] = useState<any[]>([]);
  const [activeImg, setActiveImg] = useState() as any;
  const [status, setStatus] = useState(true);

  const dispatch = useDispatch();
  const history = useHistory();
  const { actions } = useUserSlice();
  const { actions: modalActions } = useModalSlice();
  const { id } = useParams<ParamTypes>();
  const data = useSelector(selectUserDetail);

  const {
    lovePoint,
    spiritPoint,
    responsibilityPoint,
    innocencePoint,
    intellectPoint,
    nickname,
    email,
    phone,
    age,
    ranking,
    gender,
    totalHeart,
    personalities,
    hobbies,
    userFinal,
    area,
    description,
  } = data;

  const tmpData = [
    lovePoint,
    spiritPoint,
    responsibilityPoint,
    innocencePoint,
    intellectPoint,
  ];

  const RadarDataTest = RadarData(tmpData);

  const average = tmpData.reduce((curr, next) => {
    return curr + next;
  }, 0);

  useEffect(() => {
    dispatch(actions.getUser(id));
  }, [actions, dispatch, id]);

  useEffect(() => {
    const avatars = _.get(data, 'avatars');
    setActiveImg(_.get(data, 'avatars.0'));
    setAvatars(avatars);
    setStatus(_.get(data, 'isActive'));
  }, [data]);

  const toggle = useCallback(
    tab => {
      if (activeTab !== tab) setActiveTab(tab);
    },
    [activeTab],
  );

  const onPreviewImg = useCallback(
    (e, idx) => {
      e.preventDefault();
      setActiveImg(avatars[idx]);
    },
    [avatars],
  );

  const onBlockUser = useCallback(() => {
    const ids = [id];
    dispatch(
      modalActions.showConfirmModal({
        title: '??????',
        description: '???????????? ?????? / ?????? ?????? ???????????????????',
        onYes: () => {
          dispatch(actions.blockUser({ ids, status }));
          setStatus(!status);
        },
        onNo: () => {
          dispatch(modalActions.showConfirmModal(false));
        },
      }),
    );
  }, [actions, dispatch, id, modalActions, status]);

  const getNameType = useCallback(type => {
    if (!type) {
      return '--';
    }

    return type === 'solo' ? '??????' : type === 'couple' ? '??????' : '??????';
  }, []);

  return (
    <Div>
      <ButtonBack onClick={() => history.go(-1)}>
        <BackIcon />
      </ButtonBack>
      <div className="w-100">
        <Row className="top-user">
          <Col sm={8}>
            <Col sm={12} className="d-flex align-items-baseline">
              <Title>{nickname}</Title>
              <p>
                <LocationIcon />
                <span>{(area && area.name) || '--'}</span>
              </p>
            </Col>
            <Col sm={12} className="d-flex pb-3">
              <div className="d-flex flex-column mr-3">
                <Span>??????</Span>
                <span>
                  {' '}
                  <img src={crown} alt="" /> {ranking === 0 ? '--' : ranking}
                </span>
              </div>
              <div className="d-flex flex-column">
                <Span>?????? ??????</Span>

                <span>
                  {' '}
                  <img src={heart} alt="" /> {totalHeart}
                </span>
              </div>
            </Col>
            <Col>
              <span>?????? ?????? ??????</span>
              <p className="description">{description}</p>
              <FesButton
                title={status ? '??????' : '??????'}
                onClick={onBlockUser}
              />
            </Col>
          </Col>
          <Col sm={4}>
            {avatars?.length > 0 && (
              <div className="image-info">
                <div className="text-center">
                  <img src={activeImg?.imageLink} alt="" />
                </div>
                <div className="text-center pt-3">
                  <img
                    src={avatars[0]?.imageLink}
                    alt=""
                    onClick={e => onPreviewImg(e, 0)}
                  />
                  <img
                    src={avatars[1]?.imageLink}
                    alt=""
                    className="ml-2 mr-2"
                    onClick={e => onPreviewImg(e, 1)}
                  />
                  <img
                    src={avatars[2]?.imageLink}
                    alt=""
                    onClick={e => onPreviewImg(e, 2)}
                  />
                </div>
              </div>
            )}
          </Col>
        </Row>

        <Row className="flex-column">
          <WrapTab tabs>
            <NavItem>
              <TabName
                onClick={() => {
                  toggle('1');
                }}
                className={activeTab === '1' ? 'activeTab' : ''}
              >
                <img src={person} alt="" className="mr-2" />
                {t('????????? ??????')}
              </TabName>
            </NavItem>
            <Divider />
            <NavItem>
              <TabName
                onClick={() => {
                  toggle('2');
                }}
                className={activeTab === '2' ? 'activeTab' : ''}
              >
                <img src={person} alt="" className="mr-2" />
                {t('?????? ??????')}
              </TabName>
            </NavItem>
            <Divider />
            <NavItem>
              <TabName
                onClick={() => {
                  toggle('3');
                }}
                className={activeTab === '3' ? 'activeTab' : ''}
              >
                <img src={luffing} alt="" className="mr-2" />
                {t('?????? ?????????')}
              </TabName>
            </NavItem>
          </WrapTab>
          <Border>
            <BorderLine></BorderLine>
          </Border>
        </Row>

        <WrapContent activeTab={activeTab}>
          <TabPane tabId="1">
            <Row className="user-info">
              <Col sm={2}>
                <span>????????????</span>
              </Col>
              <Col sm={10}>
                <span>{phone || '--'}</span>
              </Col>

              <Col sm={2}>
                <span>?????????</span>
              </Col>
              <Col sm={10}>
                {!email || email === 'n/a' ? '--' : <span>{email}</span>}
              </Col>

              <Col sm={2}>
                <span>??????</span>
              </Col>
              <Col sm={10}>
                <span>
                  {gender ? (gender === 'male' ? '??????' : '??????') : '--'}
                </span>
              </Col>

              <Col sm={2}>
                <span>??????</span>
              </Col>
              <Col sm={10}>
                <span>{age || '--'}</span>
              </Col>

              <Col sm={2}>
                <span>??????</span>
              </Col>
              <Col sm={10}>
                <span>{(area && area.name) || '--'}</span>
              </Col>

              <Col sm={2}>
                <span>??????</span>
              </Col>
              <Col sm={10}>
                {hobbies && hobbies.length
                  ? hobbies.map((item, idx) => (
                      <span key={item._id} className="pl-1">
                        {item.name}
                        {idx !== personalities.length - 1 ? ', ' : '.'}
                      </span>
                    ))
                  : '--'}
              </Col>

              <Col sm={2}>
                <span>??????</span>
              </Col>
              <Col sm={10}>
                {personalities && personalities.length
                  ? personalities.map((item, idx) => (
                      <span key={idx} className="pl-1">
                        {item.name}
                        {idx !== personalities.length - 1 ? ', ' : '.'}
                      </span>
                    ))
                  : '--'}
              </Col>
            </Row>
          </TabPane>

          <TabPane tabId="2">
            <Row className="user-info-target">
              <Col sm={2}>
                <span>??????</span>
              </Col>
              <Col sm={10}>
                <span>{userFinal?.nickname || '--'}</span>
              </Col>

              <Col sm={2}>
                <span>??????</span>
              </Col>
              <Col sm={10}>
                <span>{userFinal?.ranking || '--'}</span>
              </Col>

              <Col sm={2}>
                <span>?????? ??????</span>
              </Col>
              <Col sm={10}>
                <span>{userFinal?.totalHeart || '--'}</span>
              </Col>

              <Col sm={2}>
                <span>??????</span>
              </Col>
              <Col sm={10}>
                <span>
                  {userFinal?.gender
                    ? userFinal.gender === 'male'
                      ? '??????'
                      : '??????'
                    : '--'}
                </span>
              </Col>

              <Col sm={2}>
                <span>??????</span>
              </Col>
              <Col sm={10}>
                <span>{userFinal?.age || '--'}</span>
              </Col>

              <Col sm={2}>
                <span>??????</span>
              </Col>
              <Col sm={10}>
                <span>{userFinal?.area?.name || '--'}</span>
              </Col>

              <Col sm={2}>
                <span>??????</span>
              </Col>
              <Col sm={10}>
                <span> {getNameType(userFinal?.type)} </span>
              </Col>

              <Col sm={2}>
                <span>{t('??????')}</span>
              </Col>
              <Col sm={10}>
                {userFinal?.personalities?.length
                  ? userFinal.personalities.map((item, idx) => (
                      <span key={idx} className="pl-1">
                        {item.name}','
                      </span>
                    ))
                  : '--'}
              </Col>
            </Row>
          </TabPane>

          <TabPane tabId="3">
            <div className="d-flex">
              <div className="col-sm-6 col-md-6 wrap-chart">
                <Radar
                  ref={chartRef}
                  data={RadarDataTest}
                  options={RadarOptions}
                />
                <b className="average">
                  ?????? ??????: {average ? average / 5 : '---'}
                </b>
              </div>

              <div className="col-sm-6 col-md-6 wrap-result">
                <div className="result-test pt-4">
                  <b>????????? ??????</b>
                  <p>
                    <span>1.????????? ????????? ?????? ??? </span>
                    <span className="love">
                      {tmpData[0] === null ? '---' : tmpData[0]}
                    </span>
                  </p>
                  <p>
                    <span>2.????????? ?????? ????????????</span>
                    <span className="intell">
                      {tmpData[4] == null ? '---' : tmpData[4]}
                    </span>
                  </p>
                  <p>
                    <span>3.???????????? ?????? ????????? ?????????</span>
                    <span className="spirit">
                      {tmpData[1] == null ? '---' : tmpData[1]}
                    </span>
                  </p>
                  <p>
                    <span>4.????????? ?????? ???????????? ?????????</span>
                    <span className="innocen">
                      {tmpData[2] == null ? '---' : tmpData[2]}
                    </span>
                  </p>
                  <p>
                    <span>5.????????? ?????? ????????? ?????????</span>
                    <span className="responsibi">
                      {tmpData[3] == null ? '---' : tmpData[3]}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </TabPane>
        </WrapContent>
      </div>
    </Div>
  );
});

const Div = styled.div`
  height: 100%;
  padding: 1rem;
  background: #f5f6f8;

  display: flex;
  align-items: baseline;

  .top-user {
    padding: 0.5rem 0 3rem 0;

    span {
      color: #2a4365;
    }

    .description {
      color: #2d6492;
    }

    .image-info {
      div:nth-child(1) {
        img {
          width: 270px;
          height: 190px;
          filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
        }
      }
      div:nth-child(2) {
        img {
          width: 65px;
          height: 50px;
          filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
        }
      }
    }
  }

  .user-info {
    div {
      margin-bottom: 1rem;
    }
  }

  .user-info-target {
    div {
      margin-bottom: 1rem;
    }
  }

  .wrap-chart {
    margin-left: -10%;

    .average {
      display: block;
      margin-top: 2rem;
      text-align: center;
      color: #ff4646;
      font-size: 24px;
    }
  }

  .wrap-result {
    .result-test {
      p {
        span:nth-child(1) {
          color: #6981a3;
          font-size: 18px;
        }

        span {
          padding-left: 1rem;
        }

        .love {
          color: #ff5766;
        }
        .intell {
          color: #127ccc;
        }
        .spirit {
          color: #ffc406;
        }
        .responsibi {
          color: #2fb24b;
        }
        .innocen {
          color: #514f4f;
        }
      }
    }
  }
`;

const Border = styled.div`
  width: 50%;
  padding-left: 30px;
`;

const BorderLine = styled.div`
  border-bottom: 2px solid;
`;

const Span = styled.span`
  font-weight: bold;
`;

const TabName = styled(NavLink)`
  color: #2c5282;
  border: none;
  &.activeTab {
    color: #2c5282;
    font-weight: bold;
    border-bottom: 1px solid;
  }
`;
const WrapTab = styled(Nav)`
  padding: 5px 30px;
  border-bottom: none;
  align-items: center;
`;
const Divider = styled.div`
  border-right: 1px solid #2c5282;
  margin: 0px 23px;
  width: 22px;
  height: 25px;
`;
const Title = styled.p`
  color: #2c5282;
  font-family: Roboto;
  font-size: 24px;
  font-weight: bold;
  padding-right: 1rem;
`;

const WrapContent = styled(TabContent)`
  padding: 20px 30px;

  span {
    color: #2a4365;
  }
`;

const ButtonBack = styled.button`
  background-color: #f5f6f8;
  border: none;

  :hover {
    background: #c6c9cc;
  }
`;
