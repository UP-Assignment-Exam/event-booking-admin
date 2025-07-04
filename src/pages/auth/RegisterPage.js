import React from 'react'

export default function RegisterPage() {
  return (
    <div>
      <div className="container-fluid mt-5">
        <div className="row justify-content-center align-items-center">
          <div className="col-md-5">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <img src="/BayonPass_logo.png" class="w-50 h-50 d-flex justify-content-center align-items-center mx-auto" alt="Logo"/>
                <form method="POST">
                  <div className="mb-3">
                    <label for="firstname" class="form-label">First Name</label>
                    <input type="text" name="firstname" id="firstname" class="form-control" required></input>
                  </div>
                  <div className="mb-3">
                    <label for="lastname" class="form-label">Last Name</label>
                    <input type="lastname" name="lastname" id="lastname" class="form-control" required></input>
                  </div>
                  <div className="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" name="email" id="email" class="form-control" required></input>
                  </div>
                  <div className="mb-3">
                    <label for="phone" class="form-label">Phone</label>
                    <input type="phone" name="phone" id="phone" class="form-control" required></input>
                  </div>
                  <div className="mb-3">
                    <label for="organizationname" class="form-label">Organization Name</label>
                    <input type="organizationname" name="organizationname" id="organizationname" class="form-control" required></input>
                  </div>
                  <div class="dropdown mb-3">
                    <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                      Select Option
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                      <li><a class="dropdown-item" href="#" onclick="selectOption('Option 1')">Option 1</a></li>
                      <li><a class="dropdown-item" href="#" onclick="selectOption('Option 2')">Option 2</a></li>
                      <li><a class="dropdown-item" href="#" onclick="selectOption('Option 3')">Option 3</a></li>
                    </ul>
                  </div>
                  <div class="mb-3">
                    <label for="phone" class="form-label">Phone Number <small class="text-muted">(Optional)</small></label>
                    <input type="tel" class="form-control" id="phone"></input>
                  </div>
                  <div class="mb-3">
                    <label for="phone" class="form-label">Phone Number <small class="text-muted">(Optional)</small></label>
                    <input type="tel" class="form-control" id="phone"></input>
                  </div>
                  <p>if you register is finish you can go to <a href='/login'>Login</a></p>
                  <button type="submit" class="btn btn-dark w-100">Register</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  )
}
