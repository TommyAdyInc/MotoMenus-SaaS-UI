import React from "react";
import axios from "axios";
import { apiURL } from "../../helpers/url";
import Loading from "../../helpers/Loading.jsx";
import CheckMark from "../../helpers/CheckMark.jsx";
import Modal from "../../components/Modal.jsx";
import { getAdminAuthToken } from "../../helpers/auth";

class DocumentFee extends React.Component {
  state = {
    document_fee: 0,
    loading: false,
    error: null
  };

  constructor(props) {
    super(props);
  }

  getDocumentFee() {
    const { api, ui } = this.props;

    this.setState({ loading: true });

    axios({
      method: "GET",
      url: apiURL(api, ui) + "/settings/document-fee",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + getAdminAuthToken()
      }
    })
      .then(({ data }) => {
        this.setState({
          document_fee: data.document_fee
        });
      })
      .catch(errors => {
        let error = (
          <Modal>
            <div className="bg-white inline-flex items-center leading-none p-2 rounded-full shadow text-red-600">
              <span className="bg-red-600 h-6 items-center inline-flex justify-center px-3 rounded-full text-white">
                Error!
              </span>
              <span className="inline-flex px-2">
                <div>Could not retrieve document fee.</div>
              </span>
              <button
                className="text-white bg-red-500 hover:bg-red-700 py-2 px-4 rounded-full"
                onClick={() => this.setState({ error: null })}
              >
                Close
              </button>
            </div>
          </Modal>
        );

        this.setState({ error });
      })
      .finally(() => this.setState({ loading: false }));
  }

  updateDocumentFee() {
    const { api, ui } = this.props;

    this.setState({ loading: true });

    axios({
      method: "PUT",
      url: apiURL(api, ui) + "/global-settings",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + getAdminAuthToken()
      },
      data: {
        document_fee: this.state.document_fee
      }
    })
      .then(() => {
        this.setState({
          save_fee: true
        });
        setTimeout(() => this.setState({ save_fee: false }), 4000);
      })
      .catch(error => console.log(error))
      .finally(() => this.setState({ loading: false }));
  }

  componentDidMount() {
    this.getDocumentFee();
  }

  render() {
    return (
      <div className="px-4 py-1 w-full">
        {this.state.loading && <Loading />}

        <div className="mb-5 rounded-lg border-blue-500 border p-0">
          <div className="p-5">
            <b className="inline-block mr-3">Document Fee</b>
            <input
              className="form-input py-0"
              type="number"
              value={this.state.document_fee}
              onChange={event =>
                this.setState({ document_fee: event.target.value })
              }
            />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded-full text-sm  ml-6"
              onClick={() => this.updateDocumentFee()}
            >
              Save
            </button>
            {this.state.save_fee && <CheckMark />}
          </div>
        </div>

        {this.state.error}
      </div>
    );
  }
}

export default DocumentFee;
