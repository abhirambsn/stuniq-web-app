//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.16;

contract Bloy {
    struct Merchant {
        string email;
        string password;
        string apiKey;
        string name;
        address addr;
        string privKey;
    }

    mapping(string => Merchant) users;

    enum Status {
        INIT,
        SUCCESS,
        FAILED
    }

    struct Payment {
        string payment_id;
        uint amount;
        string apiKey;
        string currency;
        string s_callback;
        string f_callback;
        Status status;
        uint createdAt;
        uint paidAt;
    }

    mapping(string => Payment) payments;


    struct CompleteData {
        Payment p;
        Merchant m;
    }


    function createUser(
        string memory _email,
        string memory _password,
        string memory _name,
        string memory _apiKey,
        address _addr,
        string memory _privKey
    ) external {
        Merchant memory m = Merchant(
            _email,
            _password,
            _name,
            _apiKey,
            _addr,
            _privKey
        );

        users[_email] = m;
    }

    function createPayment(
        string memory _payment_id,
        uint _amount,
        string memory _apiKey,
        string memory _currency,
        string memory _s_callback,
        string memory _f_callback
    ) external {
        Payment memory p = Payment(
            _payment_id,
            _amount,
            _apiKey,
            _currency,
            _s_callback,
            _f_callback,
            Status.INIT,
            block.timestamp,
            0
        );

        payments[_payment_id] = p;
    }

    function pay(string memory _payment_id) external payable returns (bool) {
        require(msg.value == payments[_payment_id].amount);
        payments[_payment_id].status = Status.SUCCESS;
        payments[_payment_id].paidAt = block.timestamp;
        return true;
    }

    function getData(string memory _payment_id) external view returns (CompleteData memory cd) {
        Payment memory p = payments[_payment_id];
        Merchant memory m = users[p.apiKey];
        return CompleteData(p, m);
    }
}