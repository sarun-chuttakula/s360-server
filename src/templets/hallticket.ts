import { hallTicketRequest } from "dtos"

export const hallticket = (payload: hallTicketRequest) => {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
    integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">

  <title>${payload.ht_no}</title>

  <style>
    .txt-center {
      text-align: center;
    }

    .border- {
      border: 1px solid #000 !important;
    }

    .padding {
      padding: 0px 15px;
    }

    .mar-bot {
      margin-bottom: 0px;
    }

    .admit-card {
      border: 0px solid #000;
      font-size: 12px;
    }

    .BoxA h5,
    .BoxA p {
      margin: 0;
    }

    .BoxA {
      padding: 5px 30px;
    }

    h5 {
      text-transform: uppercase;
    }

    table img {
      width: 100%;
      margin: 0 auto;
    }

    .table-bordered td,
    .table-bordered th,
    .table thead th {
      border: 1px solid #000000 !important;
    }

    td {
      font-size: 14px !important;
    }

    .table td,
    .table th {
      padding: 0.1rem;
      font-size: 14px;
    }

    .h5,h5 {
      font-size: 1.00rem;
      font-family: initial;
      font-weight: bold;
    }

    p {
      margin-top: 0;
      margin-bottom: 0rem;
      font-size: 14px;
    }

    .subtable td {
      font-weight: bold;
      font-size: 12px !important;
      text-align: center;
    }

    .subtable th {
      text-align: center;
    }

    .table td,
    .table th {

      border-top: 0px;
    }

    table img {
      width: 80px;
      margin: 0 auto;
    }

    .table-bordered td,
    .table-bordered th,
    .table thead th {
      border: 0px !important;
    }

    body,
    p {
      font-size: 14px;
    }

    .table {
      margin-bottom: 0px;
    }
  </style>

</head>

<body>

  <section>
    <div class="container">


      <div class="admit-card">
        <div class="BoxA  mar-bot">
          <div class="row">

            <div class="col-sm-2" style="padding-left:6%;">
              <img src="https://www.kmit.in/images/kmit-bar.png" width="100px;" />
            </div>
            <div class="col-sm-8 text-center">
              <h5>Keshav Memorial Institute of Technology<br />
                <b>(AUTONOMOUS)</b><br />
                Narayanguda, Hyderabad, Telangana 500029
              </h5>
              <p>B.Tech COMPUTER SCIENCE AND ENGINEERING</p>
            </div>

            <div class="col-sm-2 text-center">
              <p style="text-transform:UPPERCASE">Hall Ticket </p>
              <p><b>Original</b></p>
              <p style="text-transform:UPPERCASE;border:1px solid gray;margin: 4px 20px;">CSE</p>
            </div>
          </div>
        </div>

        <div class="row" style="border:2px solid gray;border-width:2px 0px;margin: 5px 16px;">
          <div class="col-sm-3">
            <p>Exam center</p>
          </div>
          <div class="col-sm-6 text-center font-weight-bold">
            <p>Keshav Memorial Institute of Technology</p>

          </div>

          <div class="col-sm-3 ">
            <p style="text-transform:UPPERCASE;font-size:13px">Hall Ticket : <b>${payload.ht_no}</b></p>

          </div>
        </div>

        <div class="BoxD  padding mar-bot">
          <div class="row">
            <div class="col-sm-12">
              <table class="table ">
                <tbody>
                  <tr>
                    <td>1.</td>

                    <td>Name of Student </td>
                    <td><b> ${payload.name} </b></td>
                    <td rowspan="5" style="width: 10%;">
                      <img style="width:120px;height:130px;"
                        src="${payload.profile_pic}" width="123px"
                        height="165px" />
                    </td>
                  </tr>
                  <tr>
                    <td>2.</td>

                    <td>Gender </td>
                    <td><b> ${payload.gender} </b></td>

                  </tr>
                  <tr>
                    <td>3.</td>

                    <td>Month and Year of Examination </td>
                    <td><b> FEBRUARY-${payload.year}</b></td>

                  </tr>
                  <tr>
                    <td>4.</td>

                    <td>Regular/Supplementary </td>
                    <td><b>Regular</b></td>

                  </tr>

                </tbody>
              </table>

              <p class="text-center font-weight-bold " style="border:2px solid gray;border-width:2px 0px;">List of
                Theory Subjects Registered</p>

              <table class="table ">

                <thead>
                  <th>SL NO</th>
                  <th>Date of Exam</th>
                  <th>Subject Code</th>
                  <th>Subject Name</th>
                  <th>Session</th>
                </thead>
                <tbody>


                  <tr style="border-top: 1px solid;">
                    <td>1.</td>
                    <td> ${payload.date} </td>
                    <td> 155AB </td>
                    <td> SOFTWARE ENGINEERING</td>
                    <td> AN</td>
                  </tr>

                  <tr style="border-top: 1px solid;">
                    <td colspan="5">Session Timings AN: 02:00 PM TO 05:00 PM</td>
                  </tr>

                  <tr>
                    <td colspan="5" style="border:0px;">
                      <div class="row">

                        <div class="col-sm-4 ">
                          <img src='http://portal.teleuniv.in//public/img/blank.png'
                            style="width:50%;height:60px;" /><br />

                          <b>Student Signature</b>
                        </div>

                        <div class="col-sm-4 text-center">

                          <img src='https://e7.pngegg.com/pngimages/883/292/png-clipart-signature-block-email-email-miscellaneous-angle-thumbnail.png'
                            style="width:50%;height:40px;margin-top:20px;" />

                          <br />
                          <b>Controller of Examinations</b>
                        </div>

                        <div class="col-sm-4 text-center">
                          <img src='https://upload.wikimedia.org/wikipedia/commons/a/aa/Henry_Oaminal_Signature.png'
                            style="width:50%;height:60px;" /><br />
                          <b>Chief Controller of Examinations</b>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="admit-card" style=" border: 2px solid #a4a4a4;">
        <div class="col-sm-12">
          <div class="text-center"><b>----------------------------------INSTRUCTIONS TO THE
              STUDENT----------------------------------------</b></div>
          <ol style="  margin-bottom: 10px; font-size:11px">
            <li>All the students must be present in the examination hall before the commencement of the examination and
              students who come
              after the commencement of examination will not be allowed.</li>
            <li>Students should not carry any other material except Hall Ticket,Identity card and Scientfic
              non-programmable calculator.</li>
            <li>Programmable calculators,palm computers,mobile phones and pagers are not permitted into examination
              halls.They should
              show Hall Ticket and Identity card to the Invigilator/Observer/Chief Superintendent whenever they are
              asked.</li>
            <li>Students are allowed to leave the examination hall only after one and half hour from the commencement of
              the examination.
            <li>Students must handover the answer books to the invigilator before leaving the examination hall.</li>
            <li>The University reserves the right to cancel the admission of the student at any stage when it is
              detected that his/her admission to
              the examination or the college is against rules.
            </li>
          </ol>
          <p style="padding-left:28px; padding-bottom: 5px;"><b>NOTE: If there is any discrepancy in student photo
              or any other details, it should be brought to notice of the Controller of Examinations immediately.</b>
          </p>
        </div>
      </div>
    </div>
  </section>
  <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
    integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
    crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"
    integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1"
    crossorigin="anonymous"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"
    integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM"
    crossorigin="anonymous"></script>
  <script>
    var resultfound = '1';
    if (resultfound != 0)
      window.print();
  </script>
</body>
</html>`
}