import React from 'react'

export default function LoginPage() {
  return (
    <div className='container min-vh-100 d-flex justify-content-center align-items-center'>
      <div className="container-fluid">
        <div className="row justify-content-center align-items-center">
          <div className="col-md-5">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <img src="/BayonPass_logo.png" class="w-50 h-50 d-flex justify-content-center align-items-center mx-auto" alt="Logo"/>
                <form method="POST">
                  <div className="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="text" name="email" id="email" class="form-control" required></input>
                  </div>
                  <div className="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" name="password" id="password" class="form-control" required></input>
                  </div>
                  <p>if you not yet have account<a href='/register'> Register</a></p>
                  <button type="submit" class="btn btn-dark w-100">Log In</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
