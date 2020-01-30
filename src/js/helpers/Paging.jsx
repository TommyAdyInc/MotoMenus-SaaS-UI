import React from "react";

class Paging extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { paging, changePage } = this.props;

    return (
      <tfoot>
        {paging && (
          <tr>
            <td className="text-sm py-2" colSpan={5}>
              Deals {paging.from} to {paging.to} out of {paging.total}
            </td>
            <td className="text-sm py-2" colSpan={4}>
              <div className="flex align-center justify-end w-full">
                {paging.from > 1 && (
                  <a
                    href="#responsive-header"
                    onClick={() => changePage("prev")}
                    className="block border border-gray-400 border-r-0 rounded-l-full border p-1 pl-2 pr-2 ml-3 hover:text-blue-300 text-blue-600 text-sm mt-2"
                  >
                    <svg
                      className="fill-current h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M7.05 9.293L6.343 10 12 15.657l1.414-1.414L9.172 10l4.242-4.243L12 4.343z" />
                    </svg>
                  </a>
                )}
                <div
                  className={
                    "font-semibold ml-0 mr-0 border border-gray-400 p-1 pl-2 pr-2 block text-blue-600 mt-2 " +
                    (paging.total <= paging.to ? "rounded-r" : "") +
                    (parseInt(paging.from) === 1 ? " rounded-l" : "")
                  }
                >
                  {paging.current_page} OF {paging.last_page}
                </div>
                {paging.total > paging.to && (
                  <a
                    href="#responsive-header"
                    onClick={() => changePage("next")}
                    className="ml-0 border border-gray-400 border-l-0 rounded-r-full p-1 pl-2 pr-2 block mr-3 hover:text-blue-300 text-blue-600 text-sm mt-2"
                  >
                    <svg
                      className="fill-current h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
                    </svg>
                  </a>
                )}
              </div>
            </td>
          </tr>
        )}
      </tfoot>
    );
  }
}

export default Paging;
